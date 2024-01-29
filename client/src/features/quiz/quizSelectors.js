import { createSelector } from 'reselect';

// Memoized selector to transform 'classesById' object into an array
export const selectQuizDataArray = createSelector(
	(state) => state.quiz.quizzesById,
	(quizzesById) => Object.values(quizzesById)
);
