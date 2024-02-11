import { StatusCodes } from 'http-status-codes';
import QuizAttempt from '../../models/QuizAttemptModel.js';
import Student from '../../models/StudentModel.js';

// Controller to save quiz results in student's profile
export const saveResultsQuizAttempt = async (req, res) => {
	const { studentId, quizAttemptId } = req.params;

	try {
		const quizAttempt = await QuizAttempt.findById(quizAttemptId).populate(
			'quiz'
		);
		const currentDate = new Date();

		// Check if the release date has passed or if manual release is triggered
		if (
			currentDate >= quizAttempt.quiz.releaseDate ||
			quizAttempt.quiz.manualRelease
		) {
			// Update the student's performance record
			await Student.updateOne(
				{ _id: studentId, 'performance.class': quizAttempt.quiz._id },
				{ $push: { 'performance.$.quizzesTaken': quizAttemptId } }
			);

			res.status(StatusCodes.OK).json({ message: 'Quiz results saved' });
		} else {
			res.status(StatusCodes.OK).json({
				message: 'Quiz results will be released later',
			});
		}
	} catch (error) {
		console.error('Error saving quiz results:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
