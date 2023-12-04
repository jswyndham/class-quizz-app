import { createSlice } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
import {
	fetchQuizzes,
	createQuiz,
	updateQuiz,
	deleteQuiz,
	addQuestionToQuiz,
} from './quizAPI';

const initialState = {
	quiz: [], // Array to hold quiz data
	loading: false, // Loading state for async operations
	error: null, // Error state for handling API errors
};

const quizSlice = createSlice({
	name: 'quiz',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// GET ALL CLASSES
			.addCase(fetchQuizzes.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchQuizzes.fulfilled, (state, action) => {
				if (!isEqual(state.quiz, action.payload.allQuizzes)) {
					state.quiz = action.payload.allQuizzes;
				}
				state.loading = false;
			})
			.addCase(fetchQuizzes.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			// CREATE NEW CLASS
			.addCase(createQuiz.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createQuiz.fulfilled, (state, action) => {
				state.loading = false;
				console.log(action.payload);
				state.quiz.push(action.payload);
			})
			.addCase(createQuiz.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(updateQuiz.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateQuiz.fulfilled, (state, action) => {
				const index = state.quiz.findIndex(
					(c) => c._id === action.payload._id
				);
				if (index !== -1) {
					state.quiz[index] = action.payload;
				}
			})
			.addCase(updateQuiz.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(deleteQuiz.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteQuiz.fulfilled, (state, action) => {
				state.quiz = state.quiz.filter((c) => c.id !== action.payload);
			})
			.addCase(deleteQuiz.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(addQuestionToQuiz.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(addQuestionToQuiz.fulfilled, (state, action) => {
				const index = state.quiz.findIndex(
					(c) => c._id === action.payload._id
				);
				if (index !== -1) {
					state.quiz[index] = action.payload;
				}
			})
			.addCase(addQuestionToQuiz.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default quizSlice.reducer;
