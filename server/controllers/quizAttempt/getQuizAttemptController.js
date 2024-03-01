import { StatusCodes } from 'http-status-codes';
import QuizAttempt from '../../models/QuizAttemptModel.js';
import { getCache, setCache } from '../../utils/cache/cache.js';

// Controller to get a specific quiz attempt by its ID
export const getQuizAttempt = async (req, res) => {
	const quizAttemptId = req.params.quizAttemptId;
	const cacheKey = `quizAttempt_${quizAttemptId}`;

	try {
		console.log('QUIZ ATTEMPT ID: ', quizAttemptId);

		// Get cached data for quizAttempt
		const cachedQuizAttempt = getCache(cacheKey);
		if (cachedQuizAttempt) {
			console.log(`Cache hit for key: ${cacheKey}`);

			// Deserialize the quiz object
			const quiz = JSON.parse(cachedQuizAttempt);

			return res.status(StatusCodes.OK).json({ quizAttempt: quiz });
		}
		// Directly find the quiz attempt by its ID and populate the quiz details
		const quizAttempt = await QuizAttempt.findById(quizAttemptId).populate({
			path: 'quiz',
			select: 'quizTitle quizDescription isVisibleBeforeStart availableFrom availableUntil duration questions backgroundColor totalPoints createdAt updatedAt',
		});

		if (!quizAttempt) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz attempt not found' });
		}

		// Serialize each quiz for caching (this is for the benefit of getting the schema virtuals in the cache, which is easier to retreive)
		const serializedQuizAttempt = JSON.stringify(quizAttempt);

		// Set cache for serialized quiz attempt
		setCache(cacheKey, serializedQuizAttempt, 7200); // Caching for 2 hours
		res.status(StatusCodes.OK).json({ quizAttempt: serializedQuizAttempt });
	} catch (error) {
		console.error('Error finding quiz attempt:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
