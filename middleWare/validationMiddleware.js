import { body, param, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { CLASS_STATUS } from '../utils/constants.js';
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
				throw new BadRequestError(errorMessages);
			}
			next();
		},
	];
};

// VALIDATE CONDITIONS FOR CLASS SCHEMA INPUT VALUES
export const validateClassInput = withValidationErrors([
	body('className').notEmpty().withMessage('Class name is required'),
	body('subject').notEmpty().withMessage('Subject type is required'),
	body('school').notEmpty().withMessage('School name is required'),
	body('classStatus')
		.isIn(Object.values(CLASS_STATUS))
		.withMessage('Invalid status value'),
]);

// VALIDATE CONDITIONS FOR CLASS SCHEMA PARAM ID VALUE
export const validateIdParam = withValidationErrors([
	// withMessage() is not required b/c custom() method is an async func
	param('id').custom(async (value) => {
		// INVALID MONGO ID
		const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
		if (!isValidMongoId) throw new BadRequestError('Invalid MongoDB id');

		// INVALID ID
		const classGroup = await ClassGroup.findById(value);
		if (!classGroup)
			throw new NotFoundError(
				`Class with id ${value} could not be found.`
			);
	}),
]);
