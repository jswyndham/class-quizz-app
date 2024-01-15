import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

// Base URL for class-related operations
const BASE_URL = '/class';

// Get all classes
export const fetchClasses = createAsyncThunk('class/fetchClasses', async () => {
	const response = await customFetch.get(BASE_URL);
	return response.data;
});

// Get single class by id
export const fetchClassById = createAsyncThunk(
	'class/fetchClassById',
	async (_id, { rejectWithValue }) => {
		try {
			const response = await customFetch.get(`${BASE_URL}/${_id}`);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

// CREATE CLASS
export const createClass = createAsyncThunk(
	'class/createClass',
	async (classData) => {
		try {
			const response = await customFetch.post(BASE_URL, classData);
			return response.data;
		} catch (error) {
			return error.message;
		}
	}
);

// EDIT CLASS
export const updateClass = createAsyncThunk(
	'class/updateClass',
	async ({ _id, classData }) => {
		const response = await customFetch.patch(
			`${BASE_URL}/${_id}`,
			classData
		);
		return response.data;
	}
);

// DELETE CLASS
export const deleteClass = createAsyncThunk('class/deleteClass', async (id) => {
	await customFetch.delete(`${BASE_URL}/${id}`);
	return id;
});
