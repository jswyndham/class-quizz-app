import { createAsyncThunk } from "@reduxjs/toolkit";
import customFetch from "../../utils/customFetch";

const BASE_URL = "/quiz";

// GET ALL QUIZZES
export const fetchQuizzes = createAsyncThunk("quiz/fetchQuizzes", async () => {
  try {
    const response = await customFetch.get(BASE_URL);
    return response.data;
  } catch (error) {
    return error.message;
  }
});

// GET SINGLE QUIZ
export const fetchQuizById = createAsyncThunk(
  "quiz/fetchQuizById",
  async (_id) => {
    try {
      const response = await customFetch.get(`${BASE_URL}/${_id}`);
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
    try {
      const response = await customFetch.patch(`${BASE_URL}/${id}`, quizData);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

// DELETE QUIZ
export const deleteQuiz = createAsyncThunk("quiz/deleteQuiz", async (id) => {
  try {
    await customFetch.delete(`${BASE_URL}/${id}`);
    return id;
  } catch (error) {
    return error.message;
  }
});

// EDIT QUESTIONS
export const addQuestionToQuiz = createAsyncThunk(
  "quiz/addQuestionToQuiz",
  async ({ id, quizData }) => {
    try {
      const response = await customFetch.patch(
        `${BASE_URL}/${id}/add-question`,
        quizData
      );
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);
