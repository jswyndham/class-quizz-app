import { Router } from 'express';
import {
	validateClassInput,
	validateIdParam,
} from '../middleWare/validationMiddleware.js';
import {
	createClass,
	updateClass,
	deleteClass,
	getAllStudents,
	joinClassWithCode,
} from '../controllers/classGroup/manageClassController.js';
import {
	getClass,
	getAllClasses,
	getClassMemberships,
} from '../controllers/classGroup/getClassController.js';
import { authorizePermissions } from '../middleWare/authMiddleware.js';
import { USER_STATUS } from '../utils/constants.js';
import { validateClassIdParam } from '../validators/classValidator.js';

const router = Router();

// Route for fetching all classes and creating a new class
router.route('/').get(getAllClasses).post(validateClassInput, createClass);

// Routes that require an ID parameter
router
	.route('/:id')
	.get(getClass)
	.patch(validateIdParam, validateClassInput, updateClass)
	.delete(validateIdParam, deleteClass);

// Route to get the info of class members (students)
router.get('/:id/students', validateIdParam, getAllStudents);

router.get('/members/:id', validateClassIdParam, getClassMemberships);

// Route for students to join a class using an access code
router.post(
	'/joinWithCode',
	authorizePermissions(USER_STATUS.STUDENT),
	joinClassWithCode
);

export default router;
