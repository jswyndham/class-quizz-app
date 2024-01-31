import { validationResult } from 'express-validator';
import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from '../errors/customErrors.js';

export const withValidationErrors = (validateValues) => {
	return [
		...validateValues,
		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const errorMessages = errors.array().map((error) => error.msg);
				// Handle specific error types based on the message
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
