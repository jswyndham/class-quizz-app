import { StatusCodes } from 'http-status-codes';
import QuizAttemptModel from '../models/QuizAttemptModel.js';

// Get completed quiz by id
export const getQuizAttempt = async (req, res) => {
	try {
		const quizAttempt = await QuizAttemptModel.findById(req.params.id)
			.populate({
				path: 'quiz',
				populate: {
					path: 'questions',
				},
			})
			.then((quizAttempt) => {
				let totalScore = 0;
				quizAttempt.answers.forEach((answer) => {
					// Find the corresponding question in the quiz
					const question = quizAttempt.quiz.questions.find((q) =>
						q._id.equals(answer.questionId)
					);
					if (question) {
						// Compare answer and calculate score
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
			});
		res.status(StatusCodes.OK).json({ quizAttempt });
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
