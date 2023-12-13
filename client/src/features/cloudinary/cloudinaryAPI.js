import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

const BASE_URL = '/upload';

export const uploadCloudinaryFile = createAsyncThunk(
	'upload/uploadFile',
	async (formData, { rejectWithValue }) => {
		try {
			const response = await customFetch.post(BASE_URL, formData);

			if (!response.ok) {
				throw new Error('Server error');
			}

			return await response.json();
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
