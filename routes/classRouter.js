import { Router } from 'express';
import {
	validateClassInput,
	validateIdParam,
} from '../middleWare/validationMiddleware.js';

const router = Router();

import {
	getClass,
	getAllClasses,
	createClass,
	updateClass,
	deleteClass,
} from '../controllers/classController.js';

// validation middleware is imported and applied to the necessary routes
router.route('/').get(getAllClasses).post(validateClassInput, createClass);
router
	.route('/:id')
	.get(validateIdParam, getClass)
	.patch(validateIdParam, validateClassInput, updateClass)
	.delete(validateIdParam, deleteClass);

export default router;
