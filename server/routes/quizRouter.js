import { Router } from 'express';
import {
	getQuiz,
	getAllQuizzes,
	createQuiz,
	updateQuiz,
	deleteQuiz,
	addQuestionToQuiz,
	copyQuizToClass,
} from '../controllers/quizController.js';
import {
	validateQuizIdParam,
	validateQuizInput,
	validateQuestionInput,
} from '../validators/quizValidator.js';

const router = Router();

router
	.route('/')
	.get(getAllQuizzes)
	.post(validateQuizInput, validateQuestionInput, createQuiz);
router
	.route('/:id')
	.get(validateQuizIdParam, getQuiz)
	.patch(validateQuizIdParam, validateQuizInput, updateQuiz)
	.delete(validateQuizIdParam, deleteQuiz);
router.patch(
	'/:id/add-question',
	validateQuizIdParam,
	validateQuestionInput,
	addQuestionToQuiz
);
router.post('/:id/copy-to-class', validateQuizIdParam, copyQuizToClass);

export default router;
