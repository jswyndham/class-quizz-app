import { Router } from 'express';
import { getQuizAttempt } from '../controllers/quizAttempt/getQuizAttemptController.js';
import { submitQuizAttempt } from '../controllers/quizAttempt/submitQuizAttemptController.js';
import { updateStudentPerformance } from '../controllers/quizAttempt/updatePerformanceQuizAttemptController.js';
import { saveResultsQuizAttempt } from '../controllers/quizAttempt/saveResultsQuizAttemptController.js';
import { scoreQuizAttempt } from '../controllers/quizAttempt/scoreQuizAttemptController.js';
import { updateQuizVisibility } from '../controllers/quizAttempt/quizVisibilityController.js';
import {
	validateQuizAttemptScoring,
	validateQuizAttemptSubmission,
	validateQuizAttemptId,
} from '../validators/quizAttemptValidator.js';

const router = Router();

// Route to retrieve a specific quiz attempt
router.get('/:quizAttemptId', validateQuizAttemptId, getQuizAttempt);

// Route to submit a quiz attempt
router.post(
	'/submit/:quizAttemptId',
	validateQuizAttemptSubmission,
	submitQuizAttempt
);

// Route to score a quiz attempt
router.post(
	'/score/:quizAttemptId',
	validateQuizAttemptScoring,
	scoreQuizAttempt
);

// Route to update student performance based on a quiz attempt
router.patch(
	'/performance/:quizAttemptId',
	validateQuizAttemptId,
	updateStudentPerformance
);

// Route to save results of a quiz attempt
router.post(
	'/results/:quizAttemptId',
	validateQuizAttemptId,
	saveResultsQuizAttempt
);

// Route to update the visibility of a quiz
router.patch('/visibility/:quizId', updateQuizVisibility);

export default router;
