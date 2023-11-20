import Quiz from '../models/QuizModel.js';

// GET ALL QUIZZES
export const getAllQuizzes = async (req, res) => {
	const allQuizzes = await Quiz.find({ createdBy: req.user.userId });
	res.status(StatusCodes.OK).json({ allQuizzes });
};

// CREATE NEW QUIZ
export const createClass = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const quiz = await Quiz.create(req.body);
	return res.status(StatusCodes.CREATED).json({ quiz });
};

// GET SINGLE QUIZ
export const getClass = async (req, res) => {
	const quiz = await Quiz.findById(req.params.id);
	res.status(StatusCodes.OK).json({ quiz });
};

// UPDATE QUIZ
export const updateQuiz = async (req, res) => {
	const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.status(StatusCodes.OK).json({
		msg: 'Quiz updated',
		class: updatedQuiz,
	});
};

// DELETE QUIZ
export const deleteQuiz = async (req, res) => {
	const removedQuiz = await Quiz.findByIdAndDelete(req.params.id);
	res.status(StatusCodes.OK).json({
		msg: 'Quiz deleted',
		quiz: removedQuiz,
	});
};
