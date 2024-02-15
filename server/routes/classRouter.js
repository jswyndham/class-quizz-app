import { Router } from 'express';
import {
	validateClassInput,
	validateIdParam,
} from '../middleWare/validationMiddleware.js';
import {
	createClass,
	updateClass,
	deleteClass,
} from '../controllers/classGroup/manageClassController.js';
import {
	getClass,
	getAllClasses,
	getClassMemberships,
} from '../controllers/classGroup/getClassController.js';
import { joinClassWithCode } from '../controllers/classGroup/joinClassController.js';
import { authorizePermissions } from '../middleWare/authMiddleware.js';
import { USER_STATUS } from '../utils/constants.js';
import { validateClassIdParam } from '../validators/classValidator.js';
import { removeMemberFromClass } from '../controllers/membership/removeMembershipController.js';

const router = Router();

// Route to fetch all classes
router.get('/', getAllClasses);

// Route to create a new class
router.post('/', validateClassInput, createClass);

// Route to get, update, and delete a specific class by ID
router
	.route('/:id')
	.get(getClass)
	.patch(validateIdParam, validateClassInput, updateClass)
	.delete(validateIdParam, deleteClass);

// Route to get information on class memberships by class ID
router.get('/members/:id', validateClassIdParam, getClassMemberships);

// Route for students to join a class using an access code
router.post('/joinWithCode', joinClassWithCode);

// Route to remove a member from a class by class and user IDs
router.delete(
	'/:classId/members/:userId',
	authorizePermissions('ADMIN', 'TEACHER'),
	removeMemberFromClass
);

export default router;
