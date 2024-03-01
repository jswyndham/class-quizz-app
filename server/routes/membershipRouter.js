import { Router } from 'express';
import { getAllMemberships } from '../controllers/membership/getMembershipController.js';
import { authorizePermissions } from '../middleWare/authMiddleware.js';

const router = Router();

// Route for getting all memberships for a student
router.get('/', authorizePermissions('STUDENT'), getAllMemberships);

export default router;
