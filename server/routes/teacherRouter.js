import { Router } from 'express';
import {
	getAllTeachers,
	getSingleTeacher,
} from '../controllers/teacherController.js';
import {
	authenticateUser,
	authorizePermissions,
} from '../middleWare/authMiddleware.js';
import { USER_STATUS } from '../utils/constants.js';
import { validateTeacherId } from '../validators/teacherValidator.js';

const router = Router();

router.use(authenticateUser);

// Get all teachers registered in the site
router.get(
	'/class/:id/students',
	authorizePermissions(USER_STATUS.ADMIN.value),
	getAllTeachers
);

// Get a single teacher by ID
router.get('/:teacherId', validateTeacherId, getSingleTeacher);

// Get a single teacher by ID - route for admins
router.get(
	'/admin/:teacherId',
	authenticateUser,
	authorizePermissions(USER_STATUS.ADMIN.value),
	getSingleTeacher
);

export default router;
