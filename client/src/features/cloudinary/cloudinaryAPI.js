import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

const BASE_URL = '/upload';

export const uploadCloudinaryFile = createAsyncThunk(
	'upload/uploadFile',
	async (formData, { rejectWithValue }) => {
		try {
			console.log('API formData: ', formData);
			const response = await customFetch.post(BASE_URL, formData);

			console.log('API response: ', response);

			// Unlike the other redux API files, this function directly returns data, and lets Axios automatically handle the JSON conversion
			return response.data;
		} catch (error) {
			console.error('Error in uploadCloudinaryFile: ', error);
			const errorMessage = error.response.data || error.message;
			return rejectWithValue(errorMessage);
		}
	}
);
