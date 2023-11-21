import { Router } from 'express';
import {
	getQuiz,
	getAllQuizzes,
	createQuiz,
	updateQuiz,
	deleteQuiz,
} from '../controllers/quizController.js';
import {
	validateQuizIdParam,
	validateQuizInput,
} from '../validators/quizValidator.js';

const router = Router();

router.route('/').get(getAllQuizzes).post(validateQuizInput, createQuiz);
router
	.route('/:id')
	.get(validateQuizIdParam, getQuiz)
	.patch(validateQuizIdParam, validateQuizInput, updateQuiz)
	.delete(validateQuizIdParam, deleteQuiz);

export default router;
