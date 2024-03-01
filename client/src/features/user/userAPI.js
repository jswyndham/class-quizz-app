import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/customFetch';

const BASE_URL = '/users';

// CURRENT USER
export const fetchCurrentUser = createAsyncThunk(
	'users/fetchCurrentUser',
	async (_id, { rejectWithValue }) => {
		try {
			const response = await customFetch.get(
				`${BASE_URL}/${_id}?includeMembership=true`
			);
			return response.data;
		} catch (error) {
			console.error('Error in getUser:', error);
			return rejectWithValue(
				error.response ? error.response.data : error.message
			);
		}
	}
);

// Fetch a single user's membership details
// export const getUserMembership = createAsyncThunk(
// 	'users/getUserMembership',
// 	async ({ userId, membershipId }, { rejectWithValue }) => {
// 		try {
// 			const response = await customFetch.get(
// 				`${BASE_URL}/${userId}/membership/${membershipId}`
// 			);
// 			console.log('Membership response: ', response);
// 			return response.data;
// 		} catch (error) {
// 			console.error('Error fetching membership:', error);
// 			return rejectWithValue(error.response?.data || error.message);
// 		}
// 	}
// );
