import { createSlice } from '@reduxjs/toolkit';

import {
	fetchQuizzes,
	fetchQuizById,
	createQuiz,
	updateQuiz,
	copyQuizToClass,
	deleteQuiz,
	addQuestionToQuiz,
} from './quizAPI';

// Normalizing quizzes state shape by using an object (quizzesById: {}), rather than an array (quizzes[])
// Data entities are stored in an object keyed by their IDs rather than an array. This makes it easier to look up and update entities without having to iterate over arrays.
const initialState = {
	quizzesById: {},
	currentQuizId: null,
	loading: false,
	error: null,
};

const quizSlice = createSlice({
	name: 'quiz',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder

			// Get all quizzes
			.addCase(fetchQuizzes.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchQuizzes.fulfilled, (state, action) => {
				state.loading = false;
				(action.payload.allQuizzes || []).forEach((allQuizzes) => {
					state.quizzesById[allQuizzes._id] = allQuizzes;
				});
				state.error = null;
			})
			.addCase(fetchQuizzes.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// Fetch quiz by id
			.addCase(fetchQuizById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchQuizById.fulfilled, (state, action) => {
				state.loading = false;
				state.quizzesById[action.payload.quiz] = action.payload;
				state.currentQuizId = action.payload._id;
				state.error = null;
			})
			.addCase(fetchQuizById.rejected, (state, action) => {
				state.error = action.error.message;
				state.loading = false;
			})

			// Create new quiz
			.addCase(createQuiz.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createQuiz.fulfilled, (state, action) => {
				state.loading = false;
				state.quizzesById[action.payload._id] = action.payload;
				state.error = null;
			})
			.addCase(createQuiz.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// Update existing quiz
			.addCase(updateQuiz.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateQuiz.fulfilled, (state, action) => {
				state.loading = false;
				if (state.quizzesById[action.payload._id]) {
					state.quizzesById[action.payload._id] = action.payload;
				}
				state.error = null;
			})
			.addCase(updateQuiz.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// Copy a quiz and place in a new class
			.addCase(copyQuizToClass.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(copyQuizToClass.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.quiz.findIndex(
					(c) => c._id === action.payload._id
				);
				if (index !== -1) {
					state.quiz[index] = action.payload;
				}
				state.error = null;
			})
			.addCase(copyQuizToClass.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// Delete quiz
			.addCase(deleteQuiz.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteQuiz.fulfilled, (state, action) => {
				state.loading = false;
				delete state.quizzesById[action.payload];
				state.error = null;
			})
			.addCase(deleteQuiz.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// Add question to quiz
			.addCase(addQuestionToQuiz.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addQuestionToQuiz.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.quiz.findIndex(
					(c) => c._id === action.payload._id
				);
				if (index !== -1) {
					state.quiz[index] = action.payload;
				}
				state.error = null;
			})
			.addCase(addQuestionToQuiz.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default quizSlice.reducer;
