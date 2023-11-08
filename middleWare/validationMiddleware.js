import { body, param, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { CLASS_STATUS, USER_STATUS } from '../utils/constants.js';
import mongoose from 'mongoose';
import ClassGroup from '../models/ClassModel.js';
import User from '../models/UserModel.js';

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

// CLASS SCHEMA INPUT VALUES
export const validateClassInput = withValidationErrors([
	body('className').notEmpty().withMessage('Class name is required'),
	body('subject').notEmpty().withMessage('Subject type is required'),
	body('school').notEmpty().withMessage('School name is required'),
	body('classStatus')
		.isIn(Object.values(CLASS_STATUS))
		.withMessage('Invalid status value'),
]);

// CLASS SCHEMA PARAM ID VALUE
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

// REGISTER SCHEMA INPUT VALUES
export const validateRegisterInput = withValidationErrors([
	body('firstName').notEmpty().withMessage('First name is required'),
	body('lastName').notEmpty().withMessage('Last name is required'),
	body('email')
		.notEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Invalid email format')
		.custom(async (email) => {
			const user = await User.findOne({ email });
			if (user) {
				throw new BadRequestError('Email already exists');
			}
		}),
	body('password')
		.notEmpty()
		.withMessage('Password is required')
		.isLength({ min: 8 })
		.withMessage('Password must be at leat 8 characters in length'),
	body('location').notEmpty().withMessage('Location is required'),
	body('role')
		.isIn(Object.values(USER_STATUS))
		.withMessage('Invalid role value'),
]);

// LOGIN SCHEMA INPUT VALUES
export const validateLoginInput = withValidationErrors([
	body('email')
		.notEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Invalid email format'),
	body('password').notEmpty().withMessage('Password is required'),
]);
