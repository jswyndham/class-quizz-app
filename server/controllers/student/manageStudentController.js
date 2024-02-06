import { StatusCodes } from 'http-status-codes';
import Student from '../../models/StudentModel';
import { clearCache, getCache, setCache } from '../../utils/cache/cache';

// Update student's performance after taking a quiz
export const updateStudentPerformance = async (req, res) => {
	const { score } = req.body;

	try {
		// Find the student based on the user ID
		const student = await Student.findOne({ user: req.user._id });

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

		// Update quizzesTaken and totalScore fields
		performance.quizzesTaken.push({ quiz: req.body.id, score });
		performance.totalScore += score;

		// Save the student document
		await student.save();

		// Delete related cache
		const cacheKey = `student_${req.body.id}`;
		clearCache(cacheKey);

		res.status(StatusCodes.OK).json({
			message: 'Student performance updated',
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
