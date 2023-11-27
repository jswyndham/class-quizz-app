import { createSlice } from '@reduxjs/toolkit';
import { fetchClasses } from './classAPI';

const initialState = {
	classes: fetchClasses,
	loading: false,
	error: null,
	currentClass: null,
};

const classSlice = createSlice({
	name: 'class',
	initialState,
});

export default classSlice.reducer;
