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
	joinClass,
	getAllStudents,
	joinClassWithCode,
} from '../controllers/classController.js';
import { authorizePermissions } from '../middleWare/authMiddleware.js';
import { USER_STATUS } from '../utils/constants.js';

const router = Router();

// Route for fetching all classes and creating a new class
router.route('/').get(getAllClasses).post(validateClassInput, createClass);

// Routes that require an ID parameter
router
	.route('/:id')
	.get(getClass)
	.patch(validateIdParam, validateClassInput, updateClass)
	.delete(validateIdParam, deleteClass);

// Route for students to join a class group (become class members)
router.post(
	'/:id/join',
	authorizePermissions(USER_STATUS.STUDENT),
	validateIdParam,
	joinClass
);

// Route to get the info of class members (students)
router.get('/:id/students', validateIdParam, getAllStudents);

// Route for students to join a class using an access code
router.post(
	'/joinWithCode',
	authorizePermissions(USER_STATUS.STUDENT),
	joinClassWithCode
);

export default router;
