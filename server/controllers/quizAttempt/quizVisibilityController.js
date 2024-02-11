import { StatusCodes } from 'http-status-codes';
import { clearCache } from '../../utils/cache/cache.js';
import Quiz from '../../models/QuizModel.js';

export const updateQuizVisibility = async (req, res) => {
	try {
		const { quizId } = req.params;

		const quiz = await Quiz.findById(quizId);

		// Check if the quiz exists
		if (!quiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz not found' });
		}

		// Get the current date for comparison
		const currentDate = new Date();

		// Check if the current date falls within the quiz's availability period
		const isWithinAvailability =
			currentDate >= quiz.availableFrom &&
			currentDate <= quiz.availableUntil;

		// Check if the quiz is set to be visible before the start date ('availableFrom')
		const isVisibleBeforeStart =
			quiz.isVisibleBeforeStart && currentDate < quiz.availableFrom;

		// Update quiz's 'isActive' status
		// The quiz becomes active if it's within the availability period
		// or if it's set to be visible before the start date and the current date is before 'availableFrom'
		if (isWithinAvailability || isVisibleBeforeStart) {
			quiz.isActive = true;
		} else {
			// If neither condition is met, the quiz should not be active
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Quiz is not yet available' });
		}

		// Save the updated quiz
		await quiz.save();

		// Clear the quiz cache
		clearCache(`quiz_${quizId}`);

		res.status(StatusCodes.OK).json({
			message: 'Quiz visibility updated',
			quiz,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
