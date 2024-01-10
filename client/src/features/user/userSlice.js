import { createSlice } from '@reduxjs/toolkit';
import { fetchCurrentUser } from './userAPI';

const initialState = {
	user: [],
	loading: false,
	error: null,
	currentUser: null,
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
			})
			.addCase(fetchCurrentUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default userSlice.reducer;