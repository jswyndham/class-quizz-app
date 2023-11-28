import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '../src/features/quiz/quizSlice';
import classReducer from '../src/features/classGroup/classSlice';
import logger from 'redux-logger';
import error from './features/classGroup/middleWare/error';

export const store = configureStore({
	reducer: { class: classReducer, quiz: quizReducer },
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware(),
		logger,
		error,
	],
});
