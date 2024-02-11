import { StatusCodes } from 'http-status-codes';
import QuizAttempt from '../../models/QuizAttemptModel.js';
import sanitizeHtml from 'sanitize-html';

// Controller for a student to submit a quiz that has been attempted
export const submitQuizAttempt = async (req, res) => {
	const { studentId, quizAttemptId } = req.params;

	// Sanitize the submitted answers to ensure they're safe for storage
	const answers = req.body.answers.map((answer) => {
		// If the answer includes a responseText (for written answers), sanitize it
		if (answer.responseText) {
			answer.responseText = sanitizeHtml(answer.responseText);
		}
		// Remove any 'isCorrect' field from the answers to prevent cheating
		// This ensures students can't submit their answers with the 'isCorrect' field set
		return { ...answer, isCorrect: undefined };
	});

	try {
		// Find the quiz attempt for the given student and quiz
		let quizAttempt = await QuizAttempt.findOne({
			student: studentId,
			quiz: quizAttemptId,
		});

		// If no quiz attempt is found, return an error message
		if (!quizAttempt) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz attempt not found' });
		}

		// If the quiz attempt has already been completed, prevent re-submission
		if (quizAttempt.completed) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Quiz already submitted' });
		}

		// Update the quiz attempt and mark it as completed
		quizAttempt.answers = answers;
		quizAttempt.completed = true;
		await quizAttempt.save();

		res.status(StatusCodes.OK).json({ message: 'Quiz attempt submitted' });
	} catch (error) {
		console.error('Error submitting quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
