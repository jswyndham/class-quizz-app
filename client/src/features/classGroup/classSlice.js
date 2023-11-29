import { createSlice } from '@reduxjs/toolkit';
import { fetchClasses, createClass } from './classAPI';

const initialState = {
	classes: [],
	loading: false,
	error: null,
};

const classSlice = createSlice({
	name: 'class',
	initialState,
	reducers: {
		createClass: {
			reducer(state, action) {
				state.classes.push(action.payload);
			},
			prepare(className, subject, school, classStatus) {
				return {
					payload: {
						className,
						subject,
						school,
						classStatus,
					},
				};
			},
		},
	},
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
				console.log(action.payload);
				state.classes.push(action.payload);
			})
			.addCase(createClass.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default classSlice.reducer;
