import User from '../models/UserModel.js';
import { StatusCodes } from 'http-status-codes';
import { USER_STATUS } from '../utils/constants.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';

export const register = async (req, res) => {
	const isFirstAccount = (await User.countDocuments()) === 0;
	req.body.role = isFirstAccount ? USER_STATUS.ADMIN : USER_STATUS.TEACHER;

	// PASSWORD ENCRYPTION
	const hashedPassword = await hashPassword(req.body.password);
	req.body.password = hashedPassword;

	// CREATE USER
	const user = await User.create(req.body);
	res.status(StatusCodes.CREATED).json({ msg: 'User registered', user });
	res.send('register');
};

export const login = async (req, res) => {
	const user = await User.findOne({ email: req.body.email });

	const isValidUser =
		user && (await comparePassword(req.body.password, user.password));

	if (!isValidUser) throw new UnauthenticatedError('Invalid login');

	user.role === USER_STATUS.ADMIN && user.firstName === 'James'
		? res.send(`Welcome, my grand architect, Overlord ${user.firstName}`)
		: res.send(`Welcome, ${user.firstName}`);
};
