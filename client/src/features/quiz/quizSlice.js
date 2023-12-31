import { createSlice } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
import {
	fetchQuizzes,
	fetchQuizById,
	createQuiz,
	updateQuiz,
	copyQuizToClass,
	deleteQuiz,
	addQuestionToQuiz,
} from './quizAPI';

const initialState = {
	quiz: [],
	currentQuiz: null,
	loading: false,
	error: null,
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
				state.quiz = action.payload.allQuizzes;
				state.loading = false;
			})
			.addCase(fetchQuizzes.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// FETCH QUIZ BY ID
			.addCase(fetchQuizById.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchQuizById.fulfilled, (state, action) => {
				state.loading = false;
				state.currentQuiz = action.payload.quiz;
			})
			.addCase(fetchQuizById.rejected, (state, action) => {
				state.error = action.error.message;
				state.loading = false;
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

			// Update existing quiz
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

			// Copy a quiz and place in a new class
			.addCase(copyQuizToClass.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(copyQuizToClass.fulfilled, (state, action) => {
				const index = state.quiz.findIndex(
					(c) => c._id === action.payload._id
				);
				if (index !== -1) {
					state.quiz[index] = action.payload;
				}
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
				state.quiz = state.quiz.filter((c) => c.id !== action.payload);
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
