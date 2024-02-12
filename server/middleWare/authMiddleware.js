import {
	UnauthenticatedError,
	UnauthorizedError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
	// First, try to get the token from the cookie
	let token = req.cookies.token;

	// If token is not found in cookie, check the authorization header
	if (!token) {
		token = req.headers.authorization?.split(' ')[1];
	}

	// If no token is found in either place, throw an error
	if (!token) {
		throw new UnauthenticatedError('Authentication invalid');
	}

	try {
		// Verify the token and attach the user info to the request
		const { userId, userStatus } = verifyJWT(token);
		req.user = { userId, userStatus };

		console.log('Authenticated user:', req.user);
		next();
	} catch (error) {
		throw new UnauthenticatedError('Authentication invalid');
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
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: 'Unauthorized: Access restricted to teachers only',
		});
	}
	next();
};
