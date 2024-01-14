import { StatusCodes } from 'http-status-codes';
import Student from '../models/StudentModel';

// Find and return all students that are members of the student collection (across all classes)
export const getAllStudents = async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10; // Number of students per page
	const skip = (page - 1) * limit;

	try {
		const allStudents = await Student.find({})
			.populate({ path: 'classGroup' })
			.populate({ path: 'user', select: 'firstName lastName email' })
			.skip(skip)
			.limit(limit)
			.exec();

		if (!allStudents) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'No students found' });
		}

		// Get the total count for pagination
		const total = await Student.countDocuments({
			classGroup: req.params.id,
		});

		res.status(StatusCodes.OK).json({
			students: allStudents,
			total,
			page,
			pages: Math.ceil(total / limit), // Calculates the total number of pages required to display all students
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Find a student by id
export const getSingleStudent = async (req, res) => {
	try {
		const findStudent = await Student.findById(req.user.id)
			.populate({ path: 'classGroup' })
			.populate({ path: 'user', select: 'firstName lastName email' })
			.exec();

		if (!findStudent) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Student was not found' });
		}

		res.status(StatusCodes.OK).json({ findStudent });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Update student's performance after taking a quiz
export const updateStudentPerformance = async (req, res) => {
	const { score } = req.body;

	try {
		// Find the student document
		const student = await Student.findById(req.body.id);

		if (!student) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Student not found' });
		}

		// Find or initialize performance for the class
		let performance = student.performance.find(
			(p) => p.class.toString() === req.body.id
		);
		if (!performance) {
			performance = {
				class: req.body.id,
				totalScore: 0,
				quizzesTaken: [],
			};
			student.performance.push(performance);
		}

		// Update quizzesTaken and totalScore
		performance.quizzesTaken.push({ quiz: req.body.id, score });
		performance.totalScore += score;

		// Save the student document
		await student.save();

		res.status(StatusCodes.OK).json({
			message: 'Student performance updated',
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
