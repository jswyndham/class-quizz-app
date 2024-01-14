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
const router = Router();

router
	.route()
	.get(
		'/class/:id/students',
		getAllStudents,
		checkIsTeacher,
		authorizePermissions(USER_STATUS.TEACHER.value)
	);
router
	.route('/class/:id/students/:id')
	.get(getSingleStudent, authorizePermissions(USER_STATUS.TEACHER))
	.post(updateStudentPerformance);

export default router;
