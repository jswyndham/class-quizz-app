import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Middleware for validating quizAttemptId format
export const validateQuizAttemptId = (req, res, next) => {
	const { quizAttemptId } = req.params;

	if (!mongoose.Types.ObjectId.isValid(quizAttemptId)) {
		return res
			.status(400)
			.json({ message: 'Invalid quiz attempt ID format' });
	}

	next();
};

// Middleware to validate the submission of student quiz
export const validateQuizAttemptSubmission = [
	param('studentId').isMongoId().withMessage('Invalid student ID format'),
	param('quizAttemptId')
		.isMongoId()
		.withMessage('Invalid quiz attempt ID format'),
	body('answers').isArray().withMessage('Answers must be an array'),
	body('answers.*.questionId')
		.isMongoId()
		.withMessage('Invalid question ID format'),
	body('answers.*.responseText')
		.optional()
		.isString()
		.isLength({ max: 1000 })
		.withMessage('Response text is too long'),
	// Add more validators as needed
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ errors: errors.array() });
		}
		next();
	},
];

// Middleware for the validation of student quiz before scoring
export const validateQuizAttemptScoring = [
	param('quizAttemptId')
		.isMongoId()
		.withMessage('Invalid quiz attempt ID format'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ errors: errors.array() });
		}
		next();
	},
];
