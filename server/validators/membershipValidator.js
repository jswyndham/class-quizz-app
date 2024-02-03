import { body, param } from 'express-validator';
import mongoose from 'mongoose';
import ClassGroup from '../models/ClassModel.js';
import Student from '../models/StudentModel.js';
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from '../errors/customErrors.js';
import { withValidationErrors } from './validationHelpers.js';

// Validator for studentId as a route parameter
export const validateStudentIdParam = withValidationErrors([
	param('studentId').custom(async (value, { req }) => {
		if (!mongoose.Types.ObjectId.isValid(value)) {
			throw new BadRequestError('Invalid student ID');
		}
		const student = await Student.findOne({ user: value });
		if (!student) {
			throw new NotFoundError(`Student with ID ${value} not found`);
		}
		req.student = student; // Store the student in the request object for later use
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
