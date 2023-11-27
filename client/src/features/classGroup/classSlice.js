import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	classes: [],
	loading: false,
	error: null,
	currentClass: null,
};

const classSlice = createSlice({
	name: 'class',
	initialState,
});

export default classSlice.reducer;
