import { createSlice } from '@reduxjs/toolkit';
import { fetchClasses } from './classAPI';

const initialState = {
	classes: [],
	loading: false,
	error: null,
	currentClass: null,
};

const classSlice = createSlice({
	name: 'class',
	initialState,
	reducers: {
		fetchClasses: (state, action) => {
			return action.payload.class;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchClasses.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchClasses.fulfilled, (state, action) => {
				state.classes = action.payload.classGroups;
				state.loading = false;
			})
			.addCase(fetchClasses.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
		// Add cases for other async thunks as needed
	},
});

export default classSlice.reducer;
