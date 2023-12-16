import { Router } from 'express';
import {
	getQuiz,
	getAllQuizzes,
	createQuiz,
	updateQuiz,
	deleteQuiz,
	addQuestionToQuiz,
} from '../controllers/quizController.js';
import {
	validateQuizIdParam,
	validateQuizInput,
	validateQuestionInput,
} from '../validators/quizValidator.js';

const router = Router();

router.route('/').get(getAllQuizzes).post(validateQuizInput, createQuiz);
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

export default router;