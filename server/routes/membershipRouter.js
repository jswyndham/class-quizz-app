import { Router } from 'express';
import { createMembership } from '../controllers/membership/createMembershipController.js';
import {
	getStudentMemberships,
	getUserMembership,
} from '../controllers/membership/getMembershipController.js';
// import { removeMembership } from '../controllers/membership/removeMembershipController.js';
import {
	validateAccessCode,
	validateStudentIdParam,
} from '../validators/membershipValidator.js';
import { authorizePermissions } from '../middleWare/authMiddleware.js';

const router = Router();

router.route('/').post(validateAccessCode, createMembership);

router
	.route('/:classId')
	.get(
		validateStudentIdParam,
		authorizePermissions('ADMIN', 'TEACHER'),
		getStudentMemberships
	);
router
	.route('/user/:userId/membership/:classId')
	.get(
		validateStudentIdParam,
		authorizePermissions('ADMIN', 'TEACHER'),
		getUserMembership
	);

// router
// 	.route('/class/:classId/:userId')
// 	.delete(authorizePermissions('ADMIN', 'TEACHER'), removeMembership);

export default router;
