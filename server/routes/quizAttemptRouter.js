import { Router } from 'express';
import {
	validateQuizIdParam,
	validateQuizInput,
	validateQuestionInput,
} from '../validators/quizValidator.js';
import { getQuizAttempt } from '../controllers/quizAttempt/getQuizAttemptController.js';
import { submitQuizAttempt } from '../controllers/quizAttempt/submitQuizAttemptController.js';
import { updateStudentPerformance } from '../controllers/quizAttempt/updatePerformanceQuizAttemptController.js';
import { saveResultsQuizAttempt } from '../controllers/quizAttempt/saveResultsQuizAttemptController.js';
import { scoreQuizAttempt } from '../controllers/quizAttempt/scoreQuizAttemptController.js';
import { updateQuizVisibility } from '../controllers/quizAttempt/quizVisibilityController.js';

const router = Router();

router
	.route('/:quizAttemptId')
	.get(validateQuizIdParam, getQuizAttempt)
	.post(scoreQuizAttempt)
	.patch(updateStudentPerformance);
router.route('/submit/:quizAttemptId').post(submitQuizAttempt);
router.route('/results/:quizAttemptId').post(saveResultsQuizAttempt);
router.route('/visibility').post(updateQuizVisibility);

export default router;
