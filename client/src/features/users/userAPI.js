import { createAsyncThunk } from "@reduxjs/toolkit";
import customFetch from "../../utils/customFetch";

// CURRENT USER
export const fetchCurrentUser = createAsyncThunk(
  "class/fetchCurrentUser",
  async () => {
    const response = await customFetch.get("/users/current-user");
    return response.data;
  }
);
