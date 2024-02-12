import { param } from 'express-validator';
import { validationResult } from 'express-validator';

// Validator for Admin ID
export const validateAdminId = [
	param('adminId').isMongoId().withMessage('Invalid Admin ID format'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];
