import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

const BASE_URL = '/membership';

// Fetch all memberships
export const fetchMemberships = createAsyncThunk(
	'membership/fetchMemberships',
	async (_, { rejectWithValue }) => {
		try {
			const response = await customFetch.get(`${BASE_URL}`);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);
// Delete member from group
export const removeMembership = createAsyncThunk(
	'membership/removeMembership',
	async ({ userId, classId }, { rejectWithValue }) => {
		try {
			await customFetch.delete(`${BASE_URL}/${userId}/${classId}`);
			return { userId, classId };
		} catch (error) {
			console.error(`Error updating class with ID ${_id}:`, error);
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);
