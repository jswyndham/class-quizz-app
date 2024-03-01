import { createSlice } from '@reduxjs/toolkit';
import { fetchCurrentUser } from './userAPI';

const initialState = {
	user: [],
	currentUser: null,
	loading: false,
	error: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCurrentUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCurrentUser.fulfilled, (state, action) => {
				state.loading = false;
				state.currentUser = action.payload.user;
				state.error = null;
			})
			.addCase(fetchCurrentUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
		// Get single memberhip number
		// .addCase(getUserMembership.pending, (state) => {
		// 	state.loading = true;
		// 	state.error = null;
		// })
		// .addCase(getUserMembership.fulfilled, (state, action) => {
		// 	state.loading = false;
		// 	state.currentMembership = action.payload.membership;
		// 	console.log('Fetched Membership:', state.currentMembership);
		// 	state.error = null;
		// })
		// .addCase(getUserMembership.rejected, (state, action) => {
		// 	state.loading = false;
		// 	state.error = action.payload || action.error.message;
		// });
	},
});

export default userSlice.reducer;
