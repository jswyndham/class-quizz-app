import { Router } from 'express';
import {
	createMembership,
	deleteMembership,
	getClassMemberships,
	getStudentMemberships,
} from '../controllers/membershipController.js';
import {
	validateAccessCode,
	validateMembershipIds,
} from '../validators/membershipValidator.js';
import {
	authenticateUser,
	authorizePermissions,
} from '../middleWare/authMiddleware.js';

const router = Router();

router.use(authenticateUser);

router.route('/').post(createMembership);

router.route('/class/:classId').get(validateMembershipIds, getClassMemberships);

router
	.route('/student/:studentId')
	.get(
		validateMembershipIds,
		authorizePermissions('ADMIN', 'TEACHER'),
		getStudentMemberships
	);

router
	.route('/:id')
	.delete(
		validateMembershipIds,
		authorizePermissions('ADMIN', 'TEACHER'),
		deleteMembership
	);

export default router;
