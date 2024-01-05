import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

const BASE_URL = '/users';

// CURRENT USER
export const fetchCurrentUser = createAsyncThunk(
	'users/fetchCurrentUser',
	async (_id, { rejectWithValue }) => {
		try {
			const response = await customFetch.get(`${BASE_URL}/${_id}`);
			return response.data;
		} catch (error) {
			console.error('Error in getUser:', error);
			return rejectWithValue(
				error.response ? error.response.data : error.message
			);
		}
	}
);
