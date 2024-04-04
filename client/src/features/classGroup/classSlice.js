import { createSlice } from '@reduxjs/toolkit';
import {
	fetchClasses,
	fetchClassById,
	createClass,
	updateClass,
	deleteClass,
	deleteClassMember,
	joinClassWithCode,
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

				if (
					action.payload.role === 'TEACHER' ||
					action.payload.role === 'ADMIN'
				) {
					action.payload.classGroups.forEach((classGroup) => {
						state.classesById[classGroup._id] = classGroup;
					});
					state.allClassIds = action.payload.classGroups.map(
						(classGroup) => classGroup._id
					);
				} else if (action.payload.role === 'STUDENT') {
					action.payload.classGroups.forEach((classData) => {
						state.classesById[classData._id] = {
							...classData,
							quizAttempts: classData.quizAttempts,
						};
					});
					state.allClassIds = action.payload.classGroups.map(
						(classData) => classData._id
					);
				}
				state.error = null;
			})
			.addCase(fetchClasses.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			// Fetch single class by id
			.addCase(fetchClassById.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchClassById.fulfilled, (state, action) => {
				// Handle fetching single class by ID
				state.loading = false;
				const fetchedClass = action.payload.classGroup;
				if (fetchedClass && fetchedClass._id) {
					state.classesById[fetchedClass._id] = fetchedClass;
					state.currentClass = fetchedClass._id;
				} else {
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
				const newClass = action.payload.classGroup;
				state.classesById[newClass._id] = newClass;
				state.allClassIds.push(newClass._id);
				state.error = null;
			})
			// Update existing class
			.addCase(updateClass.fulfilled, (state, action) => {
				state.loading = false;
				const updatedClass = action.payload;
				if (updatedClass && updatedClass._id) {
					state.classesById[updatedClass._id] = updatedClass;
				}
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
			})
			.addCase(deleteClassMember.fulfilled, (state, action) => {
				state.loading = false;
				const { classId, userId } = action.payload;
				const classData = state.classesById[classId];
				if (classData && classData.membership) {
					// Remove the member from the membership array
					classData.membership = classData.membership.filter(
						(member) => member.user.toString() !== userId
					);
				}
				state.error = null;
			})
			// Handle joining a class with a code
			.addCase(joinClassWithCode.pending, (state) => {
				console.log('Join class request pending');
				state.loading = true;
				state.error = null;
			})
			.addCase(joinClassWithCode.fulfilled, (state, action) => {
				state.loading = false;
				const classData = action.payload.classData;
				console.log('Class Data: ', classData);

				if (classData && classData._id) {
					state.classesById[classData._id] = classData;
					if (!state.allClassIds.includes(classData._id)) {
						state.allClassIds.push(classData._id);
					}
				} else {
					console.error(
						'Invalid class data in joinClassWithCode response'
					);
				}

				state.error = null;
			})
			.addCase(joinClassWithCode.rejected, (state, action) => {
				console.error(
					'Join class request failed:',
					action.error.message
				);
				state.loading = false;
				state.error = action.payload.message || action.payload.msg;
			});
	},
});

export default classSlice.reducer;
