import { StatusCodes } from 'http-status-codes';
import QuizAttempt from '../../models/QuizAttemptModel.js';
import { QUESTION_TYPE } from '../../utils/constants.js';

// Controller for scoring a quiz attempt
export const scoreQuizAttempt = async (req, res) => {
	const { quizAttemptId } = req.params;

	try {
		// Retrieve the quiz attempt and populate the related quiz data
		const quizAttempt = await QuizAttempt.findById(quizAttemptId).populate(
			'quiz'
		);
		if (!quizAttempt) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz attempt not found' });
		}

		let score = 0;
		let containsLongAnswer = false; // Flag to check for long answer presence

		// Iterate through each answer in the quiz attempt
		quizAttempt.answers.forEach((answer) => {
			// Find the corresponding question in the quiz
			const correspondingQuestion = quizAttempt.quiz.questions.find(
				(question) => question._id.equals(answer.questionId)
			);

			// Check if the question is of type LONG_ANSWER
			if (
				correspondingQuestion.answerType ===
				QUESTION_TYPE.LONG_ANSWER.value
			) {
				containsLongAnswer = true;
			}

			// If the question is not a LONG_ANSWER, proceed with automatic scoring
			if (
				correspondingQuestion &&
				!containsLongAnswer &&
				correspondingQuestion.correctAnswer === answer.selectedOption
			) {
				score += correspondingQuestion.points;
			}
		});

		// Update the score and the fully scored flag based on the presence of long answers
		quizAttempt.score = score;
		quizAttempt.isFullyScored = !containsLongAnswer; // Set to false if there are LONG_ANSWER questions

		// Save the updated quiz attempt
		await quizAttempt.save();

		res.status(StatusCodes.OK).json({
			message: 'Quiz scored successfully',
			score,
			isFullyScored: quizAttempt.isFullyScored,
		});
	} catch (error) {
		console.error('Error scoring quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
