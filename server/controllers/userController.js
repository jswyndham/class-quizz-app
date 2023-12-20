import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import ClassGroup from '../models/ClassModel.js';

// TODO: Create try-catch statements for each controller for better error management

// Controller to get the current user
export const getCurrentUser = async (req, res) => {
	const user = await User.findOne({ _id: req.user.userId });
	const userWithoutPassword = user.toJSON();
	res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

// Controller to get application statistics
export const getApplicationStats = async (req, res) => {
	const users = await User.countDocuments();
	const classGroup = await ClassGroup.countDocuments();
	res.status(StatusCodes.OK).json({ users, classGroup });
};

// Controller to update the current user
export const updateUser = async (req, res) => {
	const obj = { ...req.body };
	// delete = don't include password in user info request
	delete obj.password;
	console.log(obj);
	const updatedUser = await User.findByIdAndUpdate(req.user.userId, obj);
	res.status(StatusCodes.OK).json({ msg: 'Update user' });
};
