import { StatusCodes } from 'http-status-codes';
import Quiz from '../../models/QuizModel.js';
import { getCache, setCache } from '../../utils/cache/cache.js';

// Controller to get all quizzes by user
export const getAllQuizzes = async (req, res) => {
	try {
		// ************** Define params ******************
		const quizId = req.params.id;
		const userId = req.user.userId;
		const cacheKey = `quiz_${userId}`;

		// ********** Get previous set cache ************
		const cachedData = getCache(cacheKey);

		if (cachedData) {
			console.log(`Cache hit for allQuizzes key: ${cacheKey}`);

			// Deserialize each item back into an object
			const allQuizzes = cachedData.map((item) => JSON.parse(item));

			return res.status(StatusCodes.OK).json({ allQuizzes });
		} else {
			console.log(`Cache miss for allQuizzes key: ${cacheKey}`);

			let allQuizzes = await Quiz.find({
				createdBy: req.user.userId,
			})
				.populate('class')
				.lean({ virtuals: true })
				.exec();

			// Serialize each quiz for caching (this is for the benefit of getting the schema virtuals in the cache, which is easier to retreive)
			const serializedQuizzes = allQuizzes.map((quiz) =>
				JSON.stringify(quiz)
			);

			// Set new cache
			setCache(cacheKey, serializedQuizzes, 3600); // Caches for 1 hour

			res.status(StatusCodes.OK).json({ allQuizzes });
		}
	} catch (error) {
		console.error('Error finding all quizzes:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to get a single quiz
export const getQuiz = async (req, res) => {
	try {
		// ************** Define params ******************
		const quizId = req.params.id;
		const userId = req.user.userId;
		const cacheKey = `quiz_${quizId}`;

		const cachedQuiz = getCache(cacheKey);
		if (cachedQuiz) {
			console.log(`Cache hit for key: ${cacheKey}`);

			// Deserialize the quiz object
			const quiz = JSON.parse(cachedQuiz);

			return res.status(StatusCodes.OK).json({ quiz: quiz });
		}

		console.log(`Cache miss for key: ${cacheKey}`);
		const quiz = await Quiz.findById(quizId)
			.populate('class')
			.lean({ virtuals: true })
			.exec();

		if (!quiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz not found' });
		}

		// Serialize the quiz for faster caching
		const serializedQuiz = JSON.stringify(quiz);
		setCache(cacheKey, serializedQuiz, 10800); // Caching for 3 hours

		res.status(StatusCodes.OK).json({ quiz });
	} catch (error) {
		console.error('Error finding quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
