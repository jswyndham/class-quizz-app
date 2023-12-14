import { Router } from 'express';
import {
	getApplicationStats,
	getCurrentUser,
	updateUser,
} from '../controllers/userController.js';
import { validateUpdateUserInput } from '../middleWare/validationMiddleware.js';
import { authorizePermissions } from '../middleWare/authMiddleware.js';
import { USER_STATUS } from '../utils/constants.js';
const router = Router();

router.get('/current-user', getCurrentUser);
router.get(
	'/admin/app-stats',
	authorizePermissions(USER_STATUS.ADMIN),
	getApplicationStats
);
router.patch('/update-user', validateUpdateUserInput, updateUser);

export default router;
