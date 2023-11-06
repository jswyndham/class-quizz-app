import ClassGroup from '../models/ClassModel.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors.js';

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
	const { id } = req.params;
	const classGroup = await ClassGroup.findById(id);

	if (!classGroup)
		throw new NotFoundError(`No job with id ${id} could be found.`);

	res.status(StatusCodes.OK).json({ classGroup });
};

// UPDATE CLASS
export const updateClass = async (req, res) => {
	const { id } = req.params;
	const updatedClass = await ClassGroup.findByIdAndUpdate(id, req.body, {
		new: true,
	});
	if (!updatedClass)
		throw new NotFoundError(`No job with id ${id} could be found.`);

	res.status(StatusCodes.OK).json({
		msg: 'Class was updated',
		class: updatedClass,
	});
};

// DELETE Class
export const deleteClass = async (req, res) => {
	const { id } = req.params;
	const removedClass = await ClassGroup.findByIdAndDelete(id);
	if (!removedClass)
		throw new NotFoundError(`No job with id ${id} could be found.`);

	res.status(StatusCodes.OK).json({
		msg: 'Class was deleted',
		class: removedClass,
	});
};
