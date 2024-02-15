// import { createAsyncThunk } from '@reduxjs/toolkit';
// import customFetch from '../../utils/customFetch';

// // Base URL for class-related operations
// const BASE_URL = '/membership';

// // Fetch a single user's membership details
// export const getUserMembership = createAsyncThunk(
// 	'membership/getUserMembership',
// 	async ({ userId, membershipId }, { rejectWithValue }) => {
// 		try {
// 			const response = await customFetch.get(
// 				`${BASE_URL}/user/${userId}/membership/${membershipId}`
// 			);
// 			return response.data;
// 		} catch (error) {
// 			console.error(
// 				`Error fetching membership for user ${userId}:`,
// 				error
// 			);
// 			return rejectWithValue(error.response?.data || error.message);
// 		}
// 	}
// );

// // Delete class group
// export const removeMembership = createAsyncThunk(
// 	'membership/removeMembership',
// 	async ({ userId, classId }, { rejectWithValue }) => {
// 		try {
// 			await customFetch.delete(`${BASE_URL}/${userId}/${classId}`);
// 			return { userId, classId };
// 		} catch (error) {
// 			console.error(`Error updating class with ID ${_id}:`, error);
// 			return rejectWithValue(error.response?.data || error.message);
// 		}
// 	}
// );
