import { StatusCodes } from 'http-status-codes';
import QuizAttempt from '../../models/QuizAttemptModel.js';

// Get completed quiz by id
export const getQuizAttempt = async (req, res) => {
	const studentId = req.user.studentId;
	const quizAttemptId = req.params.id;

	// Setting the cacheKey parameters
	const cacheKey = generateCacheKey(
		`student_${studentId}, quizAttempt_${quizAttemptId}`
	);

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
			if (quizAttempt.student.toString() !== studentId) {
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
