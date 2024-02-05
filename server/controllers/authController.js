import User from '../models/UserModel.js';
import { StatusCodes } from 'http-status-codes';
import { USER_STATUS } from '../utils/constants.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';
import { clearCache, setCache } from '../utils/cache/cache.js';
import AuditLog from '../models/AuditLogModel.js';
import Student from '../models/StudentModel.js';
import Membership from '../models/MembershipModel.js';
import Teacher from '../models/TeacherModel.js';

// Controller for registering a new user
export const register = async (req, res) => {
	try {
		// Check if this is the first account to automatically assign admin status
		const isFirstAccount = (await User.countDocuments()) === 0;
		if (isFirstAccount) {
			req.body.userStatus = USER_STATUS.ADMIN.value;
		} else {
			// If userStatus is an object, use its value property (there are 'value' and 'label' properties)
			if (
				typeof req.body.userStatus === 'object' &&
				req.body.userStatus.value
			) {
				req.body.userStatus = req.body.userStatus.value;
			}
		}

		// Encrypt the user's password before saving
		const hashedPassword = await hashPassword(req.body.password);
		req.body.password = hashedPassword;

		// Create and save the new user
		const user = await User.create(req.body);

		// If the user is a student, create a student profile
		if (user.userStatus === USER_STATUS.STUDENT.value) {
			await Student.create({ user: user._id });
		}

		if (user.userStatus === USER_STATUS.TEACHER.value) {
			await Teacher.create({ user: user._id });
		}

		// Create new membership
		await Membership.create(req.body);

		// Create an audit log entry of the user's action
		if (user._id) {
			const auditLog = new AuditLog({
				action: 'REGISTER',
				subjectType: 'Registered as user',
				userId: user._id,
				details: { reason: 'User registered' },
			});
			await auditLog.save();
		}

		res.status(StatusCodes.CREATED).json({ msg: 'User registered', user });
	} catch (error) {
		console.error('Error registering user:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller for user login and setting authentication cookie
export const login = async (req, res) => {
	try {
		// Find the user by email
		const user = await User.findOne({ email: req.body.email });

		// Validate user credentials
		const isValidUser =
			user && (await comparePassword(req.body.password, user.password));

		if (!isValidUser) throw new UnauthenticatedError('Invalid login');

		// Create a JWT for the user
		const token = createJWT({
			userId: user._id,
			userStatus: user.userStatus,
		});

		// Set cookie to expire in one day
		const oneDay = 1000 * 60 * 60 * 24;

		const isProduction = process.env.NODE_ENV === 'production';

		// Set the authentication cookie
		res.cookie('token', token, {
			httpOnly: true, // prevent client-side script access to the cookie
			expires: new Date(Date.now() + oneDay),
			secure: isProduction, // send the cookie over HTTPS only
			sameSite: isProduction ? 'None' : 'Lax', // use 'None' for cross-site requests in production
		});

		// Cache user data after successful login
		const userData = { ...user.toObject(), password: undefined }; // Exclude password
		const userCacheKey = `user_${user._id}`;
		setCache(userCacheKey, userData, 3600);

		// Create an audit log entry of the user's action
		if (user._id) {
			const auditLog = new AuditLog({
				action: 'LOGIN',
				subjectType: 'Login user',
				userId: user._id,
				details: { reason: 'User logged in' },
			});
			await auditLog.save();
		}

		res.status(StatusCodes.OK).json({ msg: 'User is logged in' });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller for logging out a user and removing the authentication cookie
export const logout = async (req, res) => {
	try {
		const userId = req.user._id;

		// Set the cookie to a dummy value and make it expire immediately
		res.cookie('token', 'logout', {
			httpOnly: true,
			expires: new Date(Date.now()),
		});

		// Create an audit log entry of the user's action
		if (userId) {
			const auditLog = new AuditLog({
				action: 'LOGOUT',
				subjectType: 'Logout user',
				userId: userId,
				details: { reason: 'User logged out' },
			});
			await auditLog.save();
		}

		const userCacheKey = `user_${userId}`;
		clearCache(userCacheKey);

		res.status(StatusCodes.OK).json({ msg: 'User logged out' });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
