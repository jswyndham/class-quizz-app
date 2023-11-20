import { Router } from 'express';

const router = Router();

import {
	getQuiz,
	getAllQuizzes,
	createQuiz,
	updateQuiz,
	deleteQuiz,
} from '../controllers/quizController.js';

router.route('/').get(getAllQuizzes).post(createQuiz);
router.route('/:id').get(getQuiz).patch(updateQuiz).delete(deleteQuiz);

export default router;
