import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { validateRegisterInput } from '../middleWare/validationMiddleware.js';

const router = Router();

router.post('/register', validateRegisterInput, register);

router.post('/login', login);

export default router;
