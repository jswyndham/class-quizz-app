import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	quizzes: [], // Array to hold quiz data
	loading: false, // Loading state for async operations
	error: null, // Error state for handling API errors
	currentQuiz: null, // Data of the currently selected or active quiz
};

const quizSlice = createSlice({
	name: 'quiz',
	initialState,
});

export default quizSlice.reducer;
