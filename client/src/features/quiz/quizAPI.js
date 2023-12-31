import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

const BASE_URL = '/quiz';

// Retreive all quizzes
export const fetchQuizzes = createAsyncThunk('quiz/fetchQuizzes', async () => {
	try {
		const response = await customFetch.get(BASE_URL);
		return response.data;
	} catch (error) {
		return error.message;
	}
});

// Find a quiz by its id
export const fetchQuizById = createAsyncThunk(
	'quiz/fetchQuizById',
	async (_id) => {
		try {
			const response = await customFetch.get(`${BASE_URL}/${_id}`);
			return response.data;
		} catch (error) {
			return error.message;
		}
	}
);

// Create new quiz
export const createQuiz = createAsyncThunk(
	'quiz/createQuiz',
	async (quizData, { rejectWithValue }) => {
		try {
			const response = await customFetch.post(BASE_URL, quizData);
			return response.data;
		} catch (error) {
			console.error('Error in createQuiz:', error);
			return rejectWithValue(
				error.response ? error.response.data : error.message
			);
		}
	}
);

// Edit existing quiz
export const updateQuiz = createAsyncThunk(
	'quiz/updateQuiz',
	async ({ _id, formData }) => {
		try {
			const response = await customFetch.patch(
				`${BASE_URL}/${_id}`,
				formData
			);
			return response.data;
		} catch (error) {
			return error.message;
		}
	}
);

// Copy a quiz and place in a new class
export const copyQuizToClass = createAsyncThunk(
	'quiz/copyQuizToClass',
	async ({ _id, classId }, { rejectWithValue }) => {
		try {
			const response = await customFetch.post(
				`${BASE_URL}/${_id}/copy-to-class`,
				{
					_id,
					classId,
				}
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response ? error.response.data : error.message
			);
		}
	}
);

// Delete a quiz
export const deleteQuiz = createAsyncThunk('quiz/deleteQuiz', async (id) => {
	try {
		await customFetch.delete(`${BASE_URL}/${id}`);
		return id;
	} catch (error) {
		return error.message;
	}
});

// Edit questions inside a quiz
export const addQuestionToQuiz = createAsyncThunk(
	'quiz/addQuestionToQuiz',
	async ({ id, quizData }) => {
		try {
			const response = await customFetch.patch(
				`${BASE_URL}/${id}/add-question`,
				quizData
			);
			return response.data;
		} catch (error) {
			return error.message;
		}
	}
);
