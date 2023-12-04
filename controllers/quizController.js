import Quiz from '../models/QuizModel.js';
import { StatusCodes } from 'http-status-codes';

// GET ALL QUIZZES
export const getAllQuizzes = async (req, res) => {
	const allQuizzes = await Quiz.find({ createdBy: req.user.userId });
	res.status(StatusCodes.OK).json({ allQuizzes });
};

// CREATE NEW QUIZ
export const createQuiz = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const quiz = await Quiz.create(req.body);
	return res.status(StatusCodes.CREATED).json({ quiz });
};

// GET SINGLE QUIZ
export const getQuiz = async (req, res) => {
	const quiz = await Quiz.findById(req.params.id);
	res.status(StatusCodes.OK).json({ quiz });
};

// UPDATE QUIZ
export const updateQuiz = async (req, res) => {
	const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.status(StatusCodes.OK).json({
		msg: 'Quiz updated',
		class: quiz,
	});
};

// DELETE QUIZ
export const deleteQuiz = async (req, res) => {
	const quiz = await Quiz.findByIdAndDelete(req.params.id);
	res.status(StatusCodes.OK).json({
		msg: 'Quiz deleted',
		quiz: quiz,
	});
};

// ADD QUESTIONS
export const addQuestionToQuiz = async (req, res) => {
	try {
		const quizId = req.params.id;
		const questionData = req.body;

		const updatedQuiz = await Quiz.findByIdAndUpdate(
			quizId,
			{ $push: { questions: questionData } },
			{ new: true, runValidators: true }
		);

		if (!updatedQuiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Quiz not found' });
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
