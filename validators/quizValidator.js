import { body, param, validationResult } from 'express-validator';
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from '../errors/customErrors.js';
import { USER_STATUS } from '../utils/constants.js';
import mongoose from 'mongoose';
import Quiz from '../models/QuizModel.js';

// VALIDATION FUNCTION
const withValidationErrors = (validateValues) => {
	return [
		validateValues,
		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const errorMessages = errors.array().map((error) => error.msg);
				if (errorMessages[0].startsWith('Class with')) {
					throw new NotFoundError(errorMessages);
				}
				if (errorMessages[0].startsWith('Not authorized')) {
					throw new UnauthorizedError(
						'Not authorized to access this route'
					);
				}
				throw new BadRequestError(errorMessages);
			}
			next();
		},
	];
};

// QUIZ SCHEMA PARAM ID VALUE
export const validateQuizIdParam = withValidationErrors([
	// withMessage() is not required b/c custom() method needed for async func
	param('id').custom(async (value, { req }) => {
		// INVALID MONGO ID
		const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
		if (!isValidMongoId) throw new BadRequestError('Invalid MongoDB id');

		// INVALID ID
		const quiz = await Quiz.findById(value);
		if (!quiz)
			throw new NotFoundError(
				`Quiz with id ${value} could not be found.`
			);
		// checking for admin or owner roles
		const isAdmin = req.user.userStatus === USER_STATUS.ADMIN;
		const isOwner = req.user.userId === quiz.createdBy.toString();
		if (!isAdmin && !isOwner)
			throw new UnauthorizedError('Not authorized to access this route');
	}),
]);

// QUIZ SCHEMA INPUT VALUES
export const validateQuizInput = withValidationErrors([
	body('quizTitle')
		.notEmpty()
		.withMessage('A title for your quiz is required')
		.isLength({ max: 200 })
		.withMessage('Quiz title is too long'),
	body('questions.*.questionText')
		.notEmpty()
		.withMessage('Question text is required')
		.isLength({ max: 1000 })
		.withMessage('Question text is too long'),
	body('questions.*.answerType')
		.notEmpty()
		.withMessage('An answer type is required'),
	body('questions.*.points')
		.optional()
		.isInt({ min: 1 })
		.withMessage('Points must be a positive integer'),
	body('questions.*.options.*.optionText')
		.notEmpty()
		.withMessage('Option text is required')
		.isLength({ max: 700 })
		.withMessage('Answer text is too long'),
	body('questions.*.options.*.isCorrect')
		.isBoolean()
		.withMessage('isCorrect must be a boolean'),
]);

// QUESTION INPUT
export const validateQuestionInput = withValidationErrors([
	body('questionText')
		.notEmpty()
		.withMessage('Question text is required')
		.isLength({ max: 1000 })
		.withMessage('Question text is too long'),

	body('answerType').notEmpty().withMessage('Answer type is required'),

	body('options')
		.optional()
		.isArray()
		.withMessage('Options must be an array')
		.custom((options) => options.length > 0)
		.withMessage('At least one option is required'),

	body('options.*.optionText')
		.notEmpty()
		.withMessage('Answer text is required')
		.isLength({ max: 700 })
		.withMessage('Answer text is too long'),

	body('options.*.isCorrect')
		.isBoolean()
		.withMessage('isCorrect must be a boolean'),

	body('correctAnswer')
		.optional()
		.isInt({ min: 0 })
		.withMessage('Correct answer index must be a non-negative integer'),

	body('hints').optional().isArray().withMessage('Hints must be an array'),

	body('points')
		.optional()
		.isInt({ min: 1 })
		.withMessage('All points must be a positive number'),
]);
