import { param } from 'express-validator';
import mongoose from 'mongoose';
import ClassGroup from '../models/ClassModel.js';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { withValidationErrors } from './validationHelpers.js';

// Validator for classId as a route parameter
export const validateClassIdParam = withValidationErrors([
	param('classId').custom(async (value, { req }) => {
		if (!mongoose.Types.ObjectId.isValid(value)) {
			throw new BadRequestError('Invalid class ID');
		}
		const classGroup = await ClassGroup.findById(value);
		if (!classGroup) {
			throw new NotFoundError(`Class with ID ${value} not found`);
		}
	}),
]);
