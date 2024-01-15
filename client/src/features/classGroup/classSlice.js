import { createSlice } from '@reduxjs/toolkit';
import {
	fetchClasses,
	fetchClassById,
	createClass,
	updateClass,
	deleteClass,
} from './classAPI';

const initialState = {
	class: [],
	currentClass: null,
	loading: false,
	error: null,
};

const classSlice = createSlice({
	name: 'class',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder

			// Get all classes
			.addCase(fetchClasses.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchClasses.fulfilled, (state, action) => {
				state.loading = false;
				state.class = action.payload.classGroups;
				state.error = null;
			})
			.addCase(fetchClasses.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// Fetch single class by id
			.addCase(fetchClassById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchClassById.fulfilled, (state, action) => {
				state.loading = false;
				state.currentClass = action.payload.classGroup;
				state.error = null;
			})
			.addCase(fetchClassById.rejected, (state, action) => {
				state.error = action.error.message;
				state.loading = false;
			})

			// Crate a new class
			.addCase(createClass.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createClass.fulfilled, (state, action) => {
				state.loading = false;
				console.log(action.payload);
				state.class.push(action.payload);
				state.error = null;
			})
			.addCase(createClass.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// Update existing class
			.addCase(updateClass.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateClass.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.class.findIndex(
					(c) => c._id === action.payload._id
				);
				if (index !== -1) {
					state.class[index] = action.payload;
				}
				state.error = null;
			})
			.addCase(updateClass.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// Delete a class
			.addCase(deleteClass.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteClass.fulfilled, (state, action) => {
				state.loading = false;
				state.class = state.class.filter(
					(c) => c._id !== action.payload
				);
				state.error = null;
			})
			.addCase(deleteClass.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default classSlice.reducer;
