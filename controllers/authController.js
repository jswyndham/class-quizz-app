import User from '../models/UserModel.js';
import { StatusCodes } from 'http-status-codes';
import { USER_STATUS } from '../utils/constants.js';

export const register = async (req, res) => {
	const isFirstAccount = (await User.countDocuments()) === 0;
	req.body.role = isFirstAccount ? USER_STATUS.ADMIN : USER_STATUS.TEACHER;
	const user = await User.create(req.body);
	res.status(StatusCodes.CREATED).json({ user });
	res.send('register');
};

export const login = async (req, res) => {
	res.send('login');
};
