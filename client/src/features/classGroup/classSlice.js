import { createSlice } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
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

			// GET ALL CLASSES
			.addCase(fetchClasses.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchClasses.fulfilled, (state, action) => {
				if (!isEqual(state.class, action.payload.classGroups)) {
					state.class = action.payload.classGroups;
				}
				state.loading = false;
			})
			.addCase(fetchClasses.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// FETCH CLASS BY ID
			.addCase(fetchClassById.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchClassById.fulfilled, (state, action) => {
				state.loading = false;
				state.currentClass = action.payload.classGroup;
			})
			.addCase(fetchClassById.rejected, (state, action) => {
				state.error = action.error.message;
				state.loading = false;
			})

			// CREATE NEW CLASS
			.addCase(createClass.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createClass.fulfilled, (state, action) => {
				state.loading = false;
				console.log(action.payload);
				state.class.push(action.payload);
			})
			.addCase(createClass.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// UPDATE CLASS
			.addCase(updateClass.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateClass.fulfilled, (state, action) => {
				const index = state.class.findIndex(
					(c) => c._id === action.payload._id
				);
				if (index !== -1) {
					state.class[index] = action.payload;
				}
			})
			.addCase(updateClass.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})

			// DELETE CLASS
			.addCase(deleteClass.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteClass.fulfilled, (state, action) => {
				state.class = state.class.filter(
					(c) => c.id !== action.payload
				);
			})
			.addCase(deleteClass.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default classSlice.reducer;
