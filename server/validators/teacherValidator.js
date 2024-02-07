import { body } from 'express-validator';
import mongoose from 'mongoose';
import Teacher from '../models/TeacherModel.js';

// Validate teacher ID
export const validateTeacherId = [
	body('teacherId')
		.custom((value) => mongoose.Types.ObjectId.isValid(value))
		.withMessage('Invalid teacher ID format')
		// Check if teacher id exists
		.custom(async (value) => {
			const teacher = await Teacher.findById(value);
			if (!teacher) {
				return Promise.reject('Student ID does not exist');
			}
		}),
];
