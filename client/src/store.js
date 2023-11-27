import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '../src/features/quiz/quizSlice';
import classReducer from '../src/features/classGroup/classSlice';

export const store = configureStore({
	reducer: { class: classReducer },
	// reducer: { quiz: quizReducer },
});
