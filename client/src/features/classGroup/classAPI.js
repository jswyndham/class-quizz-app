import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for class-related operations
const BASE_URL = '/api/classes';

// Async Thunk actions
export const fetchClasses = createAsyncThunk('class/fetchClasses', async () => {
	const response = await axios.get(BASE_URL);
	return response.data;
});

export const createClass = createAsyncThunk(
	'class/createClass',
	async (classData) => {
		const response = await axios.post(BASE_URL, classData);
		return response.data;
	}
);

export const updateClass = createAsyncThunk(
	'class/updateClass',
	async ({ id, classData }) => {
		const response = await axios.patch(`${BASE_URL}/${id}`, classData);
		return response.data;
	}
);

export const deleteClass = createAsyncThunk('class/deleteClass', async (id) => {
	await axios.delete(`${BASE_URL}/${id}`);
	return id;
});

// New function to fetch a specific class by ID
export const fetchClassById = createAsyncThunk(
	'class/fetchClassById',
	async (id) => {
		const response = await axios.get(`${BASE_URL}/${id}`);
		return response.data;
	}
);
