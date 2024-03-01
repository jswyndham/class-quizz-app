import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

const BASE_URL = '/quizAttempt';

// Retrieve all quizzes
export const fetchQuizAttempt = createAsyncThunk(
	'quizAttempt/fetchQuizAttempt',
	async (quizAttemptId, { rejectWithValue }) => {
		try {
			const response = await customFetch.get(
				`${BASE_URL}/${quizAttemptId}`
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data || error.message);
		}
	}
);
