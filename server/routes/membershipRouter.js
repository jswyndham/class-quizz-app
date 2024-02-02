import { Router } from 'express';
import {
	createMembership,
	deleteMembership,
	getClassMemberships,
	getStudentMemberships,
} from '../controllers/membershipController.js';
import {
	validateAccessCode,
	validateClassIdParam,
	validateStudentIdParam,
} from '../validators/membershipValidator.js';
import {
	authenticateUser,
	authorizePermissions,
} from '../middleWare/authMiddleware.js';

const router = Router();

router.use(authenticateUser);

router.route('/').post(validateAccessCode, createMembership);

router.route('/class/:classId').get(validateClassIdParam, getClassMemberships);

router
	.route('/student/:studentId')
	.get(
		validateStudentIdParam,
		authorizePermissions('ADMIN', 'TEACHER'),
		getStudentMemberships
	);

router
	.route('/:id')
	.delete(authorizePermissions('ADMIN', 'TEACHER'), deleteMembership);

export default router;
