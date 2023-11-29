import { createSlice } from '@reduxjs/toolkit';
import { fetchClasses, createClass } from './classAPI';

const initialState = {
	classes: [],
	loading: false,
	error: null,
	currentClass: null,
};

const classSlice = createSlice({
	name: 'class',
	initialState,

	extraReducers: (builder) => {
		builder
			// GET ALL CLASSES
			.addCase(fetchClasses.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchClasses.fulfilled, (state, action) => {
				state.classes = action.payload.classGroups;
				state.loading = false;
			})
			.addCase(fetchClasses.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			// CREATE NEW CLASS
			.addCase(createClass.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createClass.fulfilled, (state, action) => {
				state.loading = false;
				state.classes.push(action.payload);
			})
			.addCase(createClass.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default classSlice.reducer;
