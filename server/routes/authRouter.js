import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import {
	validateRegisterInput,
	validateLoginInput,
} from '../middleWare/validationMiddleware.js';
import { authenticateUser } from '../middleWare/authMiddleware.js';

const router = Router();

router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);
router.get('/logout', authenticateUser, logout);

export default router;
