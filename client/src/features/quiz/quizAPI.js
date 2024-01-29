import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

const BASE_URL = '/quiz';

// Retrieve all quizzes
export const fetchQuizzes = createAsyncThunk('quiz/fetchQuizzes', async () => {
	try {
		const response = await customFetch.get(BASE_URL);
		return response.data;
	} catch (error) {
		return error.message;
	}
});

// Find a quiz by its id with caching
export const fetchQuizById = createAsyncThunk(
	'quiz/fetchQuizById',
	async (_id, { getState, rejectWithValue }) => {
		// Access the current state
		const { quiz } = getState();

		// Check if the quiz already exists in the state. If it exists, will avoid an unnecessary server request
		const existingQuiz = quiz.quizzesById[_id];
		if (existingQuiz) {
			return existingQuiz;
		}

		// If the quiz does not exist, make an API call to fetch it
		try {
			const response = await customFetch.get(`${BASE_URL}/${_id}`);
			return response.data; // Return the fetched quiz data
		} catch (error) {
			// Handle any errors during the API call
			return rejectWithValue(error.response.data || error.message);
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
			return rejectWithValue(error.response.data || error.message);
		}
	}
);

// Edit existing quiz
export const updateQuiz = createAsyncThunk(
	'quiz/updateQuiz',
	async ({ _id, formData }, { rejectWithValue }) => {
		try {
			const response = await customFetch.patch(
				`${BASE_URL}/${_id}`,
				formData
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data || error.message);
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
export const deleteQuiz = createAsyncThunk(
	'quiz/deleteQuiz',
	async (_id, { rejectWithValue }) => {
		try {
			await customFetch.delete(`${BASE_URL}/${_id}`);
			return _id; // Return the id of the deleted quiz for reducer to handle
		} catch (error) {
			return rejectWithValue(error.response.data || error.message);
		}
	}
);

// Add question to a quiz
export const addQuestionToQuiz = createAsyncThunk(
	'quiz/addQuestionToQuiz',
	async ({ id, questionData }, { rejectWithValue }) => {
		try {
			const response = await customFetch.patch(
				`${BASE_URL}/${id}/add-question`,
				questionData
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data || error.message);
		}
	}
);
