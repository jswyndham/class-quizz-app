import { createSlice } from "@reduxjs/toolkit";
import { uploadCloudinaryFile } from "./cloudinaryAPI";

const initialState = {
  uploadStatus: "idle",
  imageUrl: null,
  error: null,
};

const cloudinarySlice = createSlice({
  name: "cloudinary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadCloudinaryFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadCloudinaryFile.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadStatus = "succeeded";
        state.imageUrl = action.payload.url;
        state.error = null;
      })
      .addCase(uploadCloudinaryFile.rejected, (state, action) => {
        state.loading = false;
        state.uploadStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default cloudinarySlice.reducer;
