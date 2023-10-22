import { createSlice } from '@reduxjs/toolkit';
import classList from '../../classList';

const classSlice = createSlice({
	name: 'classGroup',
	initialState: {
		classGroups: classList,
	},
	reducers: {
		addClass: (state, action) => {
			state.classes.push(action.payload);
		},
		selectClass: (state, action) => {
			state.currentClass = action.payload;
		},
		// Add more reducers as needed
	},
});
console.log(classSlice);
console.log(classList);

export const { addClass, selectClass } = classSlice.actions;

export default classSlice.reducer;
