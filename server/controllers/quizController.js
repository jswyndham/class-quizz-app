import { StatusCodes } from 'http-status-codes';
import sanitizeHtml from 'sanitize-html';
import Quiz from '../models/QuizModel.js';

const sanitizeConfig = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe', 'img']),
	allowedAttributes: {
		...sanitizeHtml.defaults.allowedAttributes,
		iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
		img: ['src', 'alt'],
	},
	transformTags: {
		iframe: (tagName, attribs) => {
			// Regular expression to match YouTube URL in iframe src
			const youtubeRegex =
				/^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+(\?.*)?$/;
			if (attribs.src && youtubeRegex.test(attribs.src)) {
				return {
					tagName: 'iframe',
					attribs: {
						src: attribs.src,
						width: attribs.width || '560',
						height: attribs.height || '315',
						frameborder: attribs.frameborder || '0',
						allowfullscreen: attribs.allowfullscreen || '',
					},
				};
			}
			return {
				tagName: 'p',
				text: '(Video removed for security reasons)',
			};
		},
		img: (tagName, attribs) => {
			// Regular expression to match jpg and png image URLs
			const dataUrlRegex = /^data:image\/(png|jpeg|jpg);base64,/;
			const imageUrlRegex = /\.(jpg|jpeg|png)$/i;

			// Check if the src attribute of the img tag matches allowed formats
			if (
				attribs.src &&
				(dataUrlRegex.test(attribs.src) ||
					imageUrlRegex.test(attribs.src))
			) {
				// Return the img tag with its attributes if it matches the criteria
				return {
					tagName: 'img',
					attribs: {
						src: attribs.src,
						alt: attribs.alt || '',
						// You can add more attributes here if needed
					},
				};
			}
			return {
				tagName: 'p',
				text: '(Image removed for security reasons)',
			};
		},
	},
};

// GET ALL QUIZZES
export const getAllQuizzes = async (req, res) => {
	const allQuizzes = await Quiz.find({ createdBy: req.user.userId });
	res.status(StatusCodes.OK).json({ allQuizzes });
};

// GET SINGLE QUIZ
export const getQuiz = async (req, res) => {
	const quiz = await Quiz.findById(req.params.id);
	res.status(StatusCodes.OK).json({ quiz });
};

// CREATE QUIZ
export const createQuiz = async (req, res) => {
	try {
		req.body.createdBy = req.user.userId;
		console.log('Received createQuiz data:', req.body);
		if (req.body.questions && req.body.questions.length > 0) {
			req.body.questions = req.body.questions.map((question) => ({
				...question,
				questionText: sanitizeHtml(
					question.questionText,
					sanitizeConfig
				),
			}));
		}
		req.body.questions.forEach((question) => {
			question.options.forEach((option, index) => {
				option.isCorrect = index === question.correctAnswer;
			});
		});

		const quiz = await Quiz.create(req.body);
		return res.status(StatusCodes.CREATED).json({ quiz });
	} catch (error) {
		console.error('Error creating quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// UPDATE QUIZ
export const updateQuiz = async (req, res) => {
	try {
		const updateData = { ...req.body };
		console.log('Received updateQuiz data:', req.body);
		if (updateData.questions && updateData.questions.length > 0) {
			updateData.questions = updateData.questions.map((question) => ({
				...question,
				questionText: sanitizeHtml(
					question.questionText,
					sanitizeConfig
				),
				options: question.options.map((option, index) => ({
					...option,
					isCorrect: index === question.correctAnswer,
				})),
			}));
		}

		const quiz = await Quiz.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
		});

		res.status(StatusCodes.OK).json({
			msg: 'Quiz updated successfully',
			quiz,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			msg: error.message,
		});
	}
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
		const questionData = { ...req.body };

		// Sanitize question text
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
