import { Router } from 'express';
import {
	getApplicationStats,
	getCurrentUser,
	updateUser,
} from '../controllers/userController.js';
import { validateUpdateUserInput } from '../middleWare/validationMiddleware.js';
import { authorizePermissions } from '../middleWare/authMiddleware.js';
import { USER_STATUS } from '../utils/constants.js';
import { validateStudentIdParam } from '../validators/membershipValidator.js';
// import { getUserMembership } from '../controllers/membership/getMembershipController.js';
const router = Router();

router.route('/:id').get(getCurrentUser);
router.get(
	'/admin/app-stats',
	authorizePermissions(USER_STATUS.ADMIN),
	getApplicationStats
);
// router
// 	.route('/:userId/membership/:membershipId')
// 	.get(
// 		validateStudentIdParam,
// 		authorizePermissions('ADMIN', 'TEACHER', 'STUDENT'),
// 		getUserMembership
// 	);
router.patch('/update-user', validateUpdateUserInput, updateUser);

export default router;
