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
	extraReducers: (builder) => {
		builder
			.addCase(uploadCloudinaryFile.pending, (state) => {
				state.uploadStatus = 'loading';
			})
			.addCase(uploadCloudinaryFile.fulfilled, (state, action) => {
				state.uploadStatus = 'succeeded';
				state.imageUrl = action.payload.url;
			})
			.addCase(uploadCloudinaryFile.rejected, (state, action) => {
				state.uploadStatus = 'failed';
				state.error = action.payload;
			});
	},
});

export default cloudinarySlice.reducer;
