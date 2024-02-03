import { Router } from 'express';
import {
	createMembership,
	deleteMembership,
	getStudentMemberships,
} from '../controllers/membershipController.js';
import {
	validateAccessCode,
	validateStudentIdParam,
} from '../validators/membershipValidator.js';
import {
	authenticateUser,
	authorizePermissions,
} from '../middleWare/authMiddleware.js';

const router = Router();

router.use(authenticateUser);

router.route('/').post(validateAccessCode, createMembership);

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
