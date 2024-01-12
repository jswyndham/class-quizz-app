import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "./authAPI";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [loginUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [loginUser.fulfilled]: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user; // Adjust depending on your API response
      state.loading = false;
      state.error = null;
    },
    [loginUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    },
    [logoutUser.pending]: (state) => {
      state.loading = true;
    },
    [logoutUser.fulfilled]: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    [logoutUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    },
  },
});

export default authSlice.reducer;
