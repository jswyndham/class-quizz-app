import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '../src/features/quiz/quizSlice';
import classReducer from '../src/features/classGroup/classSlice';
import userReducer from '../src/features/user/userSlice';
import logger from 'redux-logger';
import error from './features/classGroup/middleWare/error';
import cloudinaryReducer from './features/cloudinary/cloudinarySlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		class: classReducer,
		quiz: quizReducer,
		cloudinary: cloudinaryReducer,
	},
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware(),
		logger,
		error,
	],
});
