import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/features/authenticate/authSlice';
import quizReducer from '../src/features/quiz/quizSlice';
import classReducer from '../src/features/classGroup/classSlice';
import userReducer from '../src/features/user/userSlice';
import membershipReducer from '../src/features/membership/membershipSlice';
import quizAttemptReducer from '../src/features/quizAttempt/quizAttemptSlice';
import logger from 'redux-logger';
import error from './features/classGroup/middleWare/error';
import cloudinaryReducer from './features/cloudinary/cloudinarySlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		user: userReducer,
		class: classReducer,
		quiz: quizReducer,
		membership: membershipReducer,
		cloudinary: cloudinaryReducer,
		quizAttempt: quizAttemptReducer,
	},
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware(),
		logger,
		error,
	],
});
