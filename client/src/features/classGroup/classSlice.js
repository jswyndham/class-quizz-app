import { createSlice } from '@reduxjs/toolkit';
import {
	fetchClasses,
	fetchClassById,
	createClass,
	updateClass,
	deleteClass,
} from './classAPI';

const initialState = {
	classesById: {},
	currentClass: null,
	allClassIds: [],
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
				action.payload.classGroups.forEach((classGroup) => {
					state.classesById[classGroup._id] = classGroup;
				});
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
				const classData = action.payload.classGroup;
				// Check a valid '_id' property
				if (classData && classData._id) {
					state.currentClass = classData; // Store the sate in 'currentClass'

					// Update allClassIds array if it doesn't include this class '_id'
					if (!state.allClassIds.includes(classData._id)) {
						state.allClassIds.push(classData._id);
					}
				} else {
					// If classData is undefined or doesn't have '_id', log an error or handle as needed
					console.error('No valid class data in payload');
				}
				state.error = null;
			})
			.addCase(fetchClassById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			// Create a new class
			.addCase(createClass.fulfilled, (state, action) => {
				state.loading = false;
				const newClass = action.payload;
				state.classesById[newClass._id] = newClass;
				state.allClassIds.push(newClass._id);
				state.error = null;
			})
			// Update existing class
			.addCase(updateClass.fulfilled, (state, action) => {
				state.loading = false;
				const updatedClass = action.payload;
				state.classesById[updatedClass._id] = updatedClass;
				state.error = null;
			})
			// Delete a class
			.addCase(deleteClass.fulfilled, (state, action) => {
				state.loading = false;
				delete state.classesById[action.payload];
				state.allClassIds = state.allClassIds.filter(
					(id) => id !== action.payload
				);
				state.error = null;
			});
	},
});

export default classSlice.reducer;
