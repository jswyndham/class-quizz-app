import { StatusCodes } from 'http-status-codes';
import Quiz from '../../models/QuizModel';
import { getCache, setCache, clearCache } from '../../utils/cache/cache.js';

// Controller to add a question to a quiz
export const addQuestionToQuiz = async (req, res) => {
	try {
		const quizId = req.params.id;
		const questionData = { ...req.body };

		// Sanitize question and option texts
		if (questionData.questionText) {
			questionData.questionText = sanitizeHtml(
				questionData.questionText,
				sanitizeConfig
			);
		}

		// Sanitize options and set correct answer
		if (questionData.options) {
			questionData.options = questionData.options.map(
				(option, index) => ({
					...option,
					optionText: sanitizeHtml(option.optionText, sanitizeConfig),
					isCorrect: index === questionData.correctAnswer,
				})
			);
		}

		// Update quiz with the new question
		const updatedQuiz = await Quiz.findByIdAndUpdate(
			quizId,
			{ $push: { questions: questionData } },
			{ new: true, runValidators: true }
		);

		// Validate if updatedQuiz exists
		if (!updatedQuiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Quiz not found' });
		}

		// If the cache already exists, update cache with new question objects
		const quizCacheKey = `quiz_${quizId}`;
		const cachedQuiz = getCache(quizCacheKey);
		if (cachedQuiz) {
			cachedQuiz.questions.push(questionData);
			setCache(quizCacheKey, cachedQuiz, 3600);
		} else {
			// Otherwise, clear the cache
			clearCache(quizCacheKey);
		}

		res.status(StatusCodes.OK).json({
			msg: 'Question added',
			quiz: updatedQuiz,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			msg: error.message,
		});
	}
};
