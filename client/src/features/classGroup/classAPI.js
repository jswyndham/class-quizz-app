import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

// Base URL for class-related operations
const BASE_URL = '/class';

// Async Thunk actions
export const fetchClasses = createAsyncThunk('class/fetchClasses', async () => {
	const response = await customFetch.get(BASE_URL);
	return response.data;
});

export const createClass = createAsyncThunk(
	'class/createClass',
	async (classData) => {
		const response = await customFetch.post(BASE_URL, classData);
		return response.data;
	}
);

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

export const deleteClass = createAsyncThunk('class/deleteClass', async (id) => {
	await customFetch.delete(`${BASE_URL}/${id}`);
	return id;
});

// New function to fetch a specific class by ID
export const fetchClassById = createAsyncThunk(
	'class/fetchClassById',
	async (id) => {
		const response = await customFetch.get(`${BASE_URL}/${id}`);
		return response.data;
	}
);
