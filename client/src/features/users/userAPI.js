import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

const BASE_URL = '/users';

// CURRENT USER
export const fetchCurrentUser = createAsyncThunk(
	'class/fetchCurrentUser',
	async () => {
		const response = await customFetch.get(`${BASE_URL}/current-user`);
		return response.data;
	}
);
