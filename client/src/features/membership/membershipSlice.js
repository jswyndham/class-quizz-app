// import { createSlice } from '@reduxjs/toolkit';
// import { getUserMembership, removeMembership } from './membershipAPI';

// const initialState = {
// 	membershipById: {},
// 	currentMembership: null,
// 	allMembershipIds: [],
// 	loading: false,
// 	error: null,
// };

// const classSlice = createSlice({
// 	name: 'membership',
// 	initialState,
// 	reducers: {},
// 	extraReducers: (builder) => {
// 		builder
// 			// Get single memberhip number
// 			.addCase(getUserMembership.pending, (state) => {
// 				state.loading = true;
// 				state.error = null;
// 			})
// 			.addCase(getUserMembership.fulfilled, (state, action) => {
// 				state.loading = false;
// 				state.membershipById[action.payload._id] = action.payload;
// 				state.currentMembership = action.payload._id;
// 				if (!state.allMembershipIds.includes(action.payload._id)) {
// 					state.allMembershipIds.push(action.payload._id);
// 				}
// 				state.error = null;
// 			})
// 			.addCase(getUserMembership.rejected, (state, action) => {
// 				state.loading = false;
// 				state.error = action.error.message;
// 			})
// 			// Delete a membership
// 			.addCase(removeMembership.pending, (state) => {
// 				state.loading = true;
// 				state.error = null;
// 			})

// 			.addCase(removeMembership.fulfilled, (state, action) => {
// 				state.loading = false;
// 				delete state.membershipById[action.payload];
// 				state.allMembershipIds = state.allMembershipIds.filter(
// 					(id) => id !== action.payload
// 				);
// 				state.error = null;
// 			})
// 			.addCase(removeMembership.rejected, (state, action) => {
// 				state.loading = false;
// 				state.error = action.error.message;
// 			});
// 	},
// });

// export default classSlice.reducer;
