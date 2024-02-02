import { body } from 'express-validator';
import mongoose from 'mongoose';
import Student from '../models/StudentModel.js';

// Validate performance update
export const validateStudentPerformanceUpdate = [
	body('score').isNumeric().withMessage('Score must be a numeric value'),
	body('classId')
		.custom((value) => mongoose.Types.ObjectId.isValid(value))
		.withMessage('Invalid class ID format'),
];

// Validate student ID
export const validateStudentId = [
	body('studentId')
		.custom((value) => mongoose.Types.ObjectId.isValid(value))
		.withMessage('Invalid student ID format')
		// Check if student id exists
		.custom(async (value) => {
			const student = await Student.findById(value);
			if (!student) {
				return Promise.reject('Student ID does not exist');
			}
		}),
];
