import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

// Base URL for class-related operations
const BASE_URL = '/class';

// Check the state
const shouldFetchClassById = (_id, state) => {
	return !state.class.classesById[_id];
};

// Get all classes
export const fetchClasses = createAsyncThunk(
	'class/fetchClasses',
	async (_, { getState, rejectWithValue }) => {
		try {
			const state = getState();
			const userRole = state.user.currentUser?.userStatus;

			if (!userRole) {
				throw new Error('User role not available');
			}

			const response = await customFetch.get(`/class?role=${userRole}`);
			return { classGroups: response.data.classGroups, role: userRole };
		} catch (error) {
			console.error('Error fetching classes:', error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// Get single class by id
export const fetchClassById = createAsyncThunk(
	'class/fetchClassById',
	async (_id, { rejectWithValue }) => {
		try {
			const response = await customFetch.get(`${BASE_URL}/${_id}`);
			return response.data;
		} catch (error) {
			console.error(`Error fetching class with ID ${_id}:`, error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// Create new class group
export const createClass = createAsyncThunk(
	'class/createClass',
	async (classData, { rejectWithValue }) => {
		try {
			const response = await customFetch.post(BASE_URL, classData);
			return response.data;
		} catch (error) {
			console.error(`Error updating class with ID ${_id}:`, error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// Edit and update class group
export const updateClass = createAsyncThunk(
	'class/updateClass',
	async ({ _id, classData }, { rejectWithValue }) => {
		try {
			const response = await customFetch.patch(
				`${BASE_URL}/${_id}`,
				classData
			);
			return response.data;
		} catch (error) {
			console.error(`Error updating class with ID ${_id}:`, error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// Delete class group
export const deleteClass = createAsyncThunk(
	'class/deleteClass',
	async (id, { rejectWithValue }) => {
		try {
			await customFetch.delete(`${BASE_URL}/${id}`);
			return id;
		} catch (error) {
			console.error(`Error updating class with ID ${_id}:`, error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// Async thunk to remove a member
export const deleteClassMember = createAsyncThunk(
	'class/removeMember',
	async ({ classId, userId }, { rejectWithValue }) => {
		try {
			await customFetch.delete(`/class/${classId}/members/${userId}`);
			return { classId, userId };
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const joinClassWithCode = createAsyncThunk(
	'class/joinClassWithCode',
	async (accessCode, { rejectWithValue }) => {
		try {
			console.log('Sending join request with access code:', accessCode);
			const response = await customFetch.post(
				`${BASE_URL}/joinWithCode`,
				{ accessCode }
			);
			console.log('Received response:', response.data);
			return response.data;
		} catch (error) {
			console.error('Error in join request:', error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);
