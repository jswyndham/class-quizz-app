import { StatusCodes } from 'http-status-codes';
import Student from '../../models/StudentModel.js';
import { clearCache } from '../../utils/cache/cache.js';
import hasPermission from '../../utils/hasPermission.js';

// Update student's performance after taking a quiz
export const updateStudentPerformance = async (req, res) => {
	// User permissions
	const userRole = req.user.userStatus;
	if (!hasPermission(userRole, 'GET_STUDENT_PERFORMANCE')) {
		return res.status(403).json({
			message: 'Forbidden: You do not have permission for this action',
		});
	}

	const score = req.params.score;

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
