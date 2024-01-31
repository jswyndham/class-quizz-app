import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Membership from '../models/MembershipModel.js';
import ClassGroup from '../models/ClassGroupModel.js';
import Student from '../models/StudentModel.js';
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from '../errors/customErrors.js';

// Validate Class and Student IDs
export const validateMembershipIds = withValidationErrors([
	body('classId').custom(async (value, { req }) => {
		try {
			if (!mongoose.Types.ObjectId.isValid(value)) {
				throw new BadRequestError('Invalid class ID');
			}
			const classGroup = await ClassGroup.findById(value);
			if (!classGroup) {
				throw new NotFoundError(`Class with ID ${value} not found`);
			}
		} catch (error) {
			throw error; // rethrow the error to be caught by withValidationErrors
		}
	}),
	body('studentId').custom(async (value, { req }) => {
		try {
			if (!mongoose.Types.ObjectId.isValid(value)) {
				throw new BadRequestError('Invalid student ID');
			}
			const student = await Student.findById(value);
			if (!student) {
				throw new NotFoundError(`Student with ID ${value} not found`);
			}
		} catch (error) {
			throw error; // rethrow the error to be caught by withValidationErrors
		}
	}),
]);

// Validate Access Code
export const validateAccessCode = withValidationErrors([
	body('accessCode')
		.notEmpty()
		.withMessage('Access code is required')
		.custom(async (accessCode, { req }) => {
			try {
				const { classId } = req.body;
				const classGroup = await ClassGroup.findById(classId);
				if (classGroup.accessCode !== accessCode) {
					throw new UnauthorizedError('Invalid access code');
				}
			} catch (error) {
				throw error; // rethrow the error to be caught by withValidationErrors
			}
		}),
]);
