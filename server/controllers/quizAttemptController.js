import { StatusCodes } from 'http-status-codes';
import QuizAttempt from '../models/QuizAttemptModel.js';
import { clearCache, setCache } from '../utils/cache/cache.js';

// Function to dynamically generate a unique cache key based on user ID and query parameters.
// This will ensure that users only access the data relevant to their requests.
const generateCacheKey = (userId, queryParams) => {
	const queryStr = JSON.stringify(queryParams);
	return `getQuizAttempt_${userId}_${queryStr}`;
};

// Get completed quiz by id
export const getQuizAttempt = async (req, res) => {
	const userId = req.user.userId;
	const quizAttemptId = req.params.id;
	// Setting the cacheKey parameters
	const cacheKey = generateCacheKey(userId, quizAttemptId);

	try {
		const cachedData = getCache(cacheKey);

		// If the cached data exists, retrieve the existing data.
		if (cachedData) {
			console.log(`Cache hit for key: ${cacheKey}`);

			return res.status(StatusCodes.OK).json({ quizAttempt: cachedData });
		} else {
			console.log(`Cache miss for key: ${cacheKey}`);
			// Find all classes organized by createdBy user

			const quizAttempt = await QuizAttempt.findById(quizAttemptId)
				.populate({
					path: 'quiz',
					populate: {
						path: 'questions',
					},
				})
				.exec();

			// Check if the user is authorized to view this quiz attempt
			if (quizAttempt.student.toString() !== userId) {
				return res.status(StatusCodes.UNAUTHORIZED).json({
					message: 'Not authorized to view this quiz attempt',
				});
			}

			let totalScore = 0;
			quizAttempt.answers.forEach((answer) => {
				const question = quizAttempt.quiz.questions.find((q) =>
					q._id.equals(answer.questionId)
				);
				if (question) {
					const correctOption = question.options.find(
						(opt) => opt.isCorrect
					);
					if (
						correctOption &&
						correctOption.optionText === answer.selectedOption
					) {
						totalScore += question.points;
					}
				}
			});

			// Set data in cache for future requests
			setCache(cacheKey, quizAttempt, 10800); // Caches for 3 hours

			// Include the total score in the response
			res.status(StatusCodes.OK).json({ quizAttempt, totalScore });
		}
	} catch (error) {
		console.error('Error finding quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

export const updateQuizVisibility = async (req, res) => {
	try {
		const { quizAttemptId } = req.params;
		const quizAttempt = await QuizAttempt.findById(quizAttemptId);

		if (!quizAttempt) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz Attempt not found' });
		}

		const cacheKey = generateCacheKey(req.user.userId, quizAttemptId);
		clearCache(cacheKey); // Invalidate the specific cache entry
		console.log('Cache key removed:', cacheKey);

		quizAttempt.isVisibleToStudent = true;
		await quizAttempt.save();

		res.status(StatusCodes.OK).json({
			message: 'Visibility updated',
			quizAttempt,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
