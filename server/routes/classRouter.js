import { Router } from 'express';
import {
	validateClassInput,
	validateIdParam,
} from '../middleWare/validationMiddleware.js';
import {
	getClass,
	getAllClasses,
	createClass,
	updateClass,
	deleteClass,
} from '../controllers/classController.js';

const router = Router();

// validation middleware is imported and applied to the necessary routes
router.route('/').get(getAllClasses).post(validateClassInput, createClass);
router
	.route('/:id')
	.get(validateIdParam, getClass)
	.patch(validateIdParam, validateClassInput, updateClass)
	.delete(validateIdParam, deleteClass);

export default router;
