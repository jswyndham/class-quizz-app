import { StatusCodes } from 'http-status-codes';
import QuizAttempt from '../../models/QuizAttemptModel.js';
import { clearCache } from '../../utils/cache/cache.js';
import Student from '../../models/StudentModel.js';

// Controller to update student's performance after a quiz attempt
export const updateStudentPerformance = async (req, res) => {
	const { studentId, quizAttemptId } = req.params;

	try {
		const quizAttempt = await QuizAttempt.findById(quizAttemptId);

		// Check that the student quiz attempt exists
		if (!quizAttempt) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz attempt not found' });
		}

		const currentDate = new Date();

		// Check if the release date has passed or if manual release is triggered
		if (
			currentDate >= quizAttempt.quiz.releaseDate ||
			quizAttempt.quiz.manualRelease
		) {
			// Update the student's performance record and push the results in the appropriate student parameter fields.
			const update = {
				$push: { 'performance.$.quizzesTaken': quizAttemptId },
				$inc: { 'performance.$.totalScore': quizAttempt.score },
			};
			await Student.updateOne(
				{ _id: studentId, 'performance.class': quizAttempt.quiz },
				update
			);

			// Clear the cache related to this quiz attempt
			const cacheKey = `student_${studentId}, quizAttempt_${quizId}`;
			clearCache(cacheKey);

			res.status(StatusCodes.OK).json({ message: 'Quiz results saved' });
		} else {
			res.status(StatusCodes.OK).json({
				message: 'Quiz results will be released later',
			});
		}
	} catch (error) {
		console.error('Error updating student performance:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
