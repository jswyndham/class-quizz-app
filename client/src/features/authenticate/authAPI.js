import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

export const registerUser = createAsyncThunk(
	'/auth/register',
	async (userData, { rejectWithValue }) => {
		try {
			const response = await customFetch.post('/auth/register', userData);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response ? error.response.data : error.message
			);
		}
	}
);

export const loginUser = createAsyncThunk(
	'/auth',
	async (userData, { rejectWithValue }) => {
		try {
			const response = await customFetch.post('/auth/login', userData);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response ? error.response.data : error.message
			);
		}
	}
);

export const logoutUser = createAsyncThunk(
	'auth/logoutUser',
	async (_, { rejectWithValue }) => {
		try {
			const response = await customFetch.get('/auth/logout');
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response ? error.response.data : error.message
			);
		}
	}
);
