import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	quizzes: [], // Array to hold quiz data
	loading: false, // Loading state for async operations
	error: null, // Error state for handling API errors
};

const quizSlice = createSlice({
	name: 'quiz',
	initialState,
});

export default quizSlice.reducer;
