import { createAsyncThunk } from "@reduxjs/toolkit";
import customFetch from "../../utils/customFetch";

const BASE_URL = "/quiz";

// Retrieve all quizzes
export const fetchQuizzes = createAsyncThunk(
  "quiz/fetchQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await customFetch.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Find a quiz by its id
export const fetchQuizById = createAsyncThunk(
  "quiz/fetchQuizById",
  async (_id, { rejectWithValue }) => {
    try {
      const response = await customFetch.get(`${BASE_URL}/${_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Create new quiz
export const createQuiz = createAsyncThunk(
  "quiz/createQuiz",
  async (quizData, { rejectWithValue }) => {
    try {
      const response = await customFetch.post(BASE_URL, quizData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Edit existing quiz
export const updateQuiz = createAsyncThunk(
  "quiz/updateQuiz",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await customFetch.patch(`${BASE_URL}/${id}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Copy a quiz and place in a new class
export const copyQuizToClass = createAsyncThunk(
  "quiz/copyQuizToClass",
  async ({ _id, classId }, { rejectWithValue }) => {
    try {
      const response = await customFetch.post(
        `${BASE_URL}/${_id}/copy-to-class`,
        {
          _id,
          classId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Delete a quiz
export const deleteQuiz = createAsyncThunk(
  "quiz/deleteQuiz",
  async (id, { rejectWithValue }) => {
    try {
      await customFetch.delete(`${BASE_URL}/${id}`);
      return id; // Return the id of the deleted quiz for reducer to handle
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// Add question to a quiz
export const addQuestionToQuiz = createAsyncThunk(
  "quiz/addQuestionToQuiz",
  async ({ id, questionData }, { rejectWithValue }) => {
    try {
      const response = await customFetch.patch(
        `${BASE_URL}/${id}/add-question`,
        questionData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);
