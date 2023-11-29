import { createSlice } from "@reduxjs/toolkit";
import { fetchClasses } from "./classAPI";

const initialState = {
  classes: [],
  loading: false,
  error: null,
  currentClass: null,
};

const classSlice = createSlice({
  name: "class",
  initialState,

  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default classSlice.reducer;
