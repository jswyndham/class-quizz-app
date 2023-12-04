import { createSlice } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
} from "./classAPI";

const initialState = {
  classes: [],
  loading: false,
  error: null,
};

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL CLASSES
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        if (!isEqual(state.classes, action.payload.classGroups)) {
          state.classes = action.payload.classGroups;
        }
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
      })
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        const index = state.classes.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default classSlice.reducer;
