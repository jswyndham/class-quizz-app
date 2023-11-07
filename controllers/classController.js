import ClassGroup from '../models/ClassModel.js';
import { StatusCodes } from 'http-status-codes';

// GET ALL CLASSES
export const getAllClasses = async (req, res) => {
	const classGroups = await ClassGroup.find();
	res.status(StatusCodes.OK).json({ classGroups });
};

// CREATE CLASS
export const createClass = async (req, res) => {
	const classGroup = await ClassGroup.create(req.body);
	return res.status(StatusCodes.CREATED).json({ classGroup });
};

// GET SINGLE CLASS
export const getClass = async (req, res) => {
	const classGroup = await ClassGroup.findById(req.params.id);
	res.status(StatusCodes.OK).json({ classGroup });
};

// UPDATE CLASS
export const updateClass = async (req, res) => {
	const updatedClass = await ClassGroup.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
		}
	);
	res.status(StatusCodes.OK).json({
		msg: 'Class was updated',
		class: updatedClass,
	});
};

// DELETE Class
export const deleteClass = async (req, res) => {
	const removedClass = await ClassGroup.findByIdAndDelete(req.params.id);
	res.status(StatusCodes.OK).json({
		msg: 'Class was deleted',
		class: removedClass,
	});
};