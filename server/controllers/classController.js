import ClassGroup from '../models/ClassModel.js';
import { StatusCodes } from 'http-status-codes';

// GET ALL CLASSES
export const getAllClasses = async (req, res) => {
	const classGroups = await ClassGroup.find({ createdBy: req.user.userId });
	res.status(StatusCodes.OK).json({ classGroups });
};

// CREATE CLASS
export const createClass = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const classGroup = await ClassGroup.create(req.body);
	return res.status(StatusCodes.CREATED).json({ classGroup });
};

// GET SINGLE CLASS
export const getClass = async (req, res) => {
	try {
		const classGroup = await ClassGroup.findById(req.params.id)
			.populate({
				path: 'quizzes',
				match: { class: { $in: [req.params.id] } }, // Check if class ID is in the array
			})
			.exec();

		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Class not found' });
		}

		// strict filtering
		if (req.query.includeQuizzes === 'true') {
			classGroup.quizzes = classGroup.quizzes.filter((quiz) =>
				quiz.class.some(
					(classId) => classId.toString() === req.params.id
				)
			);
		}

		res.status(StatusCodes.OK).json({ classGroup });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
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
