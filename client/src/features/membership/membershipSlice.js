import { createSlice } from '@reduxjs/toolkit';
import { fetchMemberships, removeMembership } from './membershipAPI';

const initialState = {
	membershipById: {},
	allMembershipIds: [],
	currentMembership: null,
	loading: false,
	error: null,
};

const membershipSlice = createSlice({
	name: 'membership',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMemberships.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMemberships.fulfilled, (state, action) => {
				state.loading = false;
				state.membershipById = {};
				state.allMembershipIds = [];
				action.payload.classGroups.forEach((group) => {
					state.membershipById[group._id] = group;
					state.allMembershipIds.push(group._id);
				});
				state.error = null;
			})
			.addCase(fetchMemberships.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || action.error.msg;
			})
			// Delete a membership
			.addCase(removeMembership.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(removeMembership.fulfilled, (state, action) => {
				state.loading = false;
				delete state.membershipById[action.payload];
				state.allMembershipIds = state.allMembershipIds.filter(
					(id) => id !== action.payload
				);
				state.error = null;
			})
			.addCase(removeMembership.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default membershipSlice.reducer;
