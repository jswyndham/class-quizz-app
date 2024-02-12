import { Router } from 'express';
import {
	getAdminMembers,
	getAdminMember,
} from '../controllers/adminController.js';
import { validateAdminId } from '../validators/adminValidator.js';

const router = Router();

// Route to get all admin members
router.get('/all', getAdminMembers);

// Route to get a single admin member with ID validation
router.get('/:adminId', validateAdminId, getAdminMember);

export default router;
