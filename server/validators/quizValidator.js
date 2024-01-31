import { body, param } from 'express-validator';
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from '../errors/customErrors.js';
import mongoose from 'mongoose';
import Quiz from '../models/QuizModel.js';
import { withValidationErrors } from './validationHelpers.js';

// Strip image tags to sanitize in the rich text editor
const stripImages = (text) => {
	if (typeof text !== 'string') {
		console.warn('stripImages expected a string, received:', typeof text);
		return '';
	}
	// This regex is a basic image setup
	return text.replace(/<img[^>]*>/g, '');
};

// Validator for validating Quiz ID
export const validateQuizIdParam = withValidationErrors([
	param('id').custom(async (value, { req }) => {
		try {
			if (!mongoose.Types.ObjectId.isValid(value)) {
				throw new BadRequestError('Invalid MongoDB id');
			}

			const quiz = await Quiz.findById(value);
			if (!quiz) {
				throw new NotFoundError(
					`Quiz with id ${value} could not be found.`
				);
			}
		} catch (error) {
			throw new UnauthorizedError('Error validating quiz ID');
		}
	}),
]);

// Validate quiz schema data
export const validateQuizInput = withValidationErrors([
	body('quizTitle')
		.notEmpty()
		.withMessage('A title for your quiz is required')
		.isLength({ max: 300 })
		.withMessage('Quiz title is too long'),
	body('questions.*.questionText')
		.notEmpty()
		.withMessage('Question text is required')
		.custom((text) => {
			const textWithoutImages = stripImages(text);
			if (textWithoutImages.length > 1000) {
				throw new Error(
					'Question text is too long when excluding images'
				);
			}
			return true;
		}),
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

// Validate question schema data
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

	body('class')
		.optional()
		.isArray()
		.custom((classes) => {
			return classes.every((cls) => mongoose.Types.ObjectId.isValid(cls));
		})
		.withMessage('Each class must be a valid ObjectId'),
]);
