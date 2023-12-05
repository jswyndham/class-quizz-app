import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

// Base URL for class-related operations
const BASE_URL = '/class';

// GET ALL CLASSES
export const fetchClasses = createAsyncThunk('class/fetchClasses', async () => {
	const response = await customFetch.get(BASE_URL);
	return response.data;
});

// // GET SINGLE CLASS
export const fetchClassById = createAsyncThunk(
	'class/fetchClassById',
	async (classId, { rejectWithValue }) => {
		try {
			const response = await customFetch.get(`${BASE_URL}/${classId}`);
			return response.data;
		} catch (error) {
			// Handle different types of errors appropriately
			if (!error.response) {
				throw error;
			}
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
			console.log(classData);
			return response.data;
		} catch (error) {
			return error.message;
		}
	}
);

// EDIT CLASS
export const updateClass = createAsyncThunk(
	'class/updateClass',
	async ({ id, classData }) => {
		const response = await customFetch.patch(
			`${BASE_URL}/${id}`,
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
