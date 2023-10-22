import { configureStore } from '@reduxjs/toolkit';
import classReducer from './features/classGroup/classSlice';

export const store = configureStore({
	reducer: {
		class: classReducer,
	},
});
