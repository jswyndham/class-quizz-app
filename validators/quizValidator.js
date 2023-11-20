import { body, param, validationResult } from 'express-validator';
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from '../errors/customErrors.js';
import { USER_STATUS } from '../utils/constants.js';
import mongoose from 'mongoose';
import ClassGroup from '../models/ClassModel.js';

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
export const validateIdParam = withValidationErrors([
	// withMessage() is not required b/c custom() method needed for async func
	param('id').custom(async (value, { req }) => {
		// INVALID MONGO ID
		const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
		if (!isValidMongoId) throw new BadRequestError('Invalid MongoDB id');

		// INVALID ID
		const classGroup = await ClassGroup.findById(value);
		if (!classGroup)
			throw new NotFoundError(
				`Class with id ${value} could not be found.`
			);
		// checking for admin or owner roles
		const isAdmin = req.user.userStatus === USER_STATUS.ADMIN;
		const isOwner = req.user.userId === classGroup.createdBy.toString();
		if (!isAdmin && !isOwner)
			throw new UnauthorizedError('Not authorized to access this route');
	}),
]);

// QUIZ SCHEMA INPUT VALUES
export const validateQuizInput = withValidationErrors([
	body('quizTitle')
		.notEmpty()
		.withMessage('A title for your quiz is required'),
	body('newQuestion')
		.notEmpty()
		.withMessage('You cuurently have no questions prepared'),
]);
