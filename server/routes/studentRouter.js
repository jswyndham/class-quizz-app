import { Router } from 'express';
import {
	getAllStudents,
	getSingleStudent,
	updateStudentPerformance,
} from '../controllers/userController.js';
import { validateUpdateUserInput } from '../middleWare/validationMiddleware.js';
import {
	authorizePermissions,
	checkIsTeacher,
} from '../middleWare/authMiddleware.js';
import { USER_STATUS } from '../utils/constants.js';
import { validateQuizIdParam } from '../validators/quizValidator.js';
import {
	validateStudentId,
	validateStudentPerformanceUpdate,
} from '../validators/studentValidator.js';
const router = Router();

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
router.post(
	'/student/performance',
	validateStudentPerformanceUpdate,
	updateStudentPerformance
);
export default router;
