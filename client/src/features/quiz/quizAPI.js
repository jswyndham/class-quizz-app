import { createAsyncThunk } from "@reduxjs/toolkit";
import customFetch from "../../utils/customFetch";

const BASE_URL = "/quiz";

// GET ALL QUIZZES
export const fetchQuizzes = createAsyncThunk("quiz/fetchQuizzes", async () => {
  const response = await customFetch.get(BASE_URL);
  return response.data;
});

// GET SINGLE QUIZ
export const fetchQuizById = createAsyncThunk(
  "quiz/fetchQuizById",
  async (id) => {
    try {
      const response = await customFetch.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

// CREATE QUIZ
export const createQuiz = createAsyncThunk(
  "quiz/createQuiz",
  async (quizData) => {
    try {
      const response = await customFetch.post(BASE_URL, quizData);
      console.log(quizData);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

// EDIT QUIZ
export const updateQuiz = createAsyncThunk(
  "quiz/updateQuiz",
  async ({ id, quizData }) => {
    const response = await customFetch.patch(`${BASE_URL}/${id}`, quizData);
    return response.data;
  }
);

// DELETE QUIZ
export const deleteQuiz = createAsyncThunk("quiz/deleteQuiz", async (id) => {
  await customFetch.delete(`${BASE_URL}/${id}`);
  return id;
});
