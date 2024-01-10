import { Router } from 'express';
import { getQuizAttempt } from '../controllers/quizAttemptController.js';
import {
	validateQuizIdParam,
	validateQuizInput,
	validateQuestionInput,
} from '../validators/quizValidator.js';

const router = Router();

router.route('/:id').get(validateQuizIdParam, getQuizAttempt);

export default router;
