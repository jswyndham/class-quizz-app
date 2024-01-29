import { createSelector } from 'reselect';

// Memoized selector to transform 'classesById' object into an array
export const selectClassDataArray = createSelector(
	(state) => state.class.classesById,
	(classesById) => Object.values(classesById)
);
