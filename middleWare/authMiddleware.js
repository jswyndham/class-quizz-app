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
		const { userId, role } = verifyJWT(token);
		req.user = { userId, role };
		next();
	} catch (error) {
		throw new UnauthenticatedError('Authenication invalid');
	}
};

export const authorizePermissions = (...role) => {
	return (req, res, next) => {
		if (!role.includes(req.user.role)) {
			throw new UnauthorizedError('Unauthorized to access this route');
		}
		next();
	};
};
