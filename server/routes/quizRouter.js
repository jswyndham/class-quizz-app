import { Router } from 'express';
import {
	getQuiz,
	getAllQuizzes,
} from '../controllers/quiz/getQuizController.js';
import {
	createQuiz,
	updateQuiz,
	deleteQuiz,
	copyQuizToClass,
} from '../controllers/quiz/manageQuizController.js';
import { addQuestionToQuiz } from '../controllers/quiz/quizQuestionsController.js';
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
