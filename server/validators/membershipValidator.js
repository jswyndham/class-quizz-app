import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import ClassGroup from '../models/ClassModel.js';
import Student from '../models/StudentModel.js';
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from '../errors/customErrors.js';
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

// Validator for studentId as a route parameter
export const validateStudentIdParam = withValidationErrors([
	param('studentId').custom(async (value, { req }) => {
		if (!mongoose.Types.ObjectId.isValid(value)) {
			throw new BadRequestError('Invalid student ID');
		}
		const student = await Student.findById(value);
		if (!student) {
			throw new NotFoundError(`Student with ID ${value} not found`);
		}
	}),
]);

// Validate Access Code
export const validateAccessCode = withValidationErrors([
	body('accessCode')
		.notEmpty()
		.withMessage('Access code is required')
		.custom(async (accessCode, { req }) => {
			const classGroup = await ClassGroup.findOne({
				accessCode: accessCode,
			});
			if (!classGroup) {
				throw new UnauthorizedError('Invalid access code');
			}
			req.classGroup = classGroup; // Attaching the classGroup to the request
		}),
]);
