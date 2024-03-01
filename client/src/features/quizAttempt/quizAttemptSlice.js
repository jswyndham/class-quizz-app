import { createSlice } from '@reduxjs/toolkit';

import { fetchQuizAttempt } from './quizAttemptAPI';

// Normalizing quizzes state shape by using an object (quizzesById: {}), rather than an array (quizzes[])
// Data entities are stored in an object keyed by their IDs rather than an array. This makes it easier to look up and update entities without having to iterate over arrays.
const initialState = {
	quizAttemptById: {},
	allQuizAttempts: [],
	currentQuizAttempt: null,
	loading: false,
	error: null,
};

const quizSlice = createSlice({
	name: 'quizAttempt',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Get quizAttempt
			.addCase(fetchQuizAttempt.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchQuizAttempt.fulfilled, (state, action) => {
				state.loading = false;
				// state of fetched data
				state.quizAttemptById[action.payload._id] = action.payload;
				// set the current quiz attempt
				state.currentQuizAttempt = action.payload;
				state.error = null;
			})
			.addCase(fetchQuizAttempt.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload.msg || action.payload.message;
			});
	},
});

export default quizSlice.reducer;
