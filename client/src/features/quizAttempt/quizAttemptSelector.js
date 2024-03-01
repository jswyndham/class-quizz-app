import { createSelector } from 'reselect';

// Memoized selector to transform 'quizAttemptById' object into an array
export const selectQuizAttemptDataArray = createSelector(
	(state) => state.quizAttempt.quizAttemptById,
	(quizAttemptById) => Object.values(quizAttemptById)
);
