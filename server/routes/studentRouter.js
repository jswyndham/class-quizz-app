import { Router } from 'express';
import {
	getAllStudents,
	getSingleStudent,
} from '../controllers/student/getStudentController.js';
import { updateStudentPerformance } from '../controllers/student/manageStudentController.js';
import {
	authenticateUser,
	authorizePermissions,
	checkIsTeacher,
} from '../middleWare/authMiddleware.js';
import { USER_STATUS } from '../utils/constants.js';
import {
	validateStudentId,
	validateStudentPerformanceUpdate,
} from '../validators/studentValidator.js';

const router = Router();

router.use(authenticateUser);

// Get all students in a class
router.get(
	'/class/:id/students',
	checkIsTeacher,
	authorizePermissions(USER_STATUS.TEACHER.value),
	getAllStudents
);

// Get a single student by ID
router.get('/student/:id', validateStudentId, getSingleStudent);

// Update student performance
router.patch(
	'/student/performance',
	validateStudentPerformanceUpdate,
	updateStudentPerformance
);
export default router;
