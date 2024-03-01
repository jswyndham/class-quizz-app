import { createSelector } from 'reselect';

// Memoized selector to transform 'quizzessById' object into an array
export const selectQuizDataArray = createSelector(
	(state) => state.quiz.quizzesById,
	(quizzesById) => Object.values(quizzesById)
);
