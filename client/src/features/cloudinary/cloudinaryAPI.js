import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

const BASE_URL = '/cloudinary';

export const uploadFile = createAsyncThunk(
	'cloudinary/uploadFile',
	async (fileData, { rejectWithValue }) => {
		try {
			const formData = new FormData();
			formData.append('file', fileData);

			const response = await customFetch.post(`${BASE_URL}/upload`);

			if (!response.ok) {
				throw new Error('Server error');
			}

			return await response.json();
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
