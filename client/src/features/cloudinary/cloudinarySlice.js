import { createSlice } from '@reduxjs/toolkit';
import { uploadCloudinaryFile } from './cloudinaryAPI';

const initialState = {
	uploadStatus: 'idle',
	imageUrl: null,
	error: null,
};

const cloudinarySlice = createSlice({
	name: 'cloudinary',
	initialState,
	reducers: {},
	extraReducers: {
		[uploadCloudinaryFile.pending]: (state) => {
			state.uploadStatus = 'loading';
		},
		[uploadCloudinaryFile.fulfilled]: (state, action) => {
			state.uploadStatus = 'succeeded';
			state.imageUrl = action.payload.url;
		},
		[uploadCloudinaryFile.rejected]: (state, action) => {
			state.uploadStatus = 'failed';
			state.error = action.payload;
		},
	},
});

export default cloudinarySlice.reducer;
