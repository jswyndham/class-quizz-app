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
				action.payload.classGroups.forEach((membershipData) => {
					// Assuming each item in classGroups array is a membership object
					state.membershipById[membershipData._id] = membershipData;
				});
				state.allMembershipIds = action.payload.classGroups.map(
					(membershipData) => membershipData._id
				);
				state.error = null;
			})
			.addCase(fetchMemberships.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
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
