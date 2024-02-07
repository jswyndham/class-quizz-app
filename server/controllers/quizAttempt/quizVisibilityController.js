import { StatusCodes } from 'http-status-codes';
import QuizAttempt from '../../models/QuizAttemptModel.js';
import { clearCache, setCache } from '../../utils/cache/cache.js';
import Student from '../../models/StudentModel.js';

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
		clearCache(cacheKey);
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
