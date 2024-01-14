import {
	UnauthenticatedError,
	UnauthorizedError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
	const { token } = req.cookies;
	if (!token) throw new UnauthenticatedError('Authenication invalid');

	try {
		// Attach the user info as an object to the verification request
		const { userId, userStatus } = verifyJWT(token);
		req.user = { userId, userStatus };
		next();
	} catch (error) {
		throw new UnauthenticatedError('Authenication invalid');
	}
};

export const authorizePermissions = (...userStatus) => {
	return (req, res, next) => {
		if (!userStatus.includes(req.user.userStatus)) {
			throw new UnauthorizedError('Unauthorized to access this route');
		}
		next();
	};
};

// Middleware to check if the user is a teacher
export const checkIsTeacher = (req, res, next) => {
	if (req.user.userStatus !== USER_STATUS.TEACHER.value) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({
				message: 'Unauthorized: Access restricted to teachers only',
			});
	}
	next();
};
