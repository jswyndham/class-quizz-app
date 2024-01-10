import mongoose from "mongoose";
import { QUESTION_TYPE } from "..//utils/constants.js";

const optionSchema = new mongoose.Schema(
  {
    optionText: String,
    isCorrect: Boolean,
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema({
  questionText: String,
  answerType: {
    type: String,
    enum: Object.values(QUESTION_TYPE).map((type) => type.value),
  },
  options: [optionSchema],

  correctAnswer: String,
  hints: [String],
  points: Number,
});

const QuizSchema = new mongoose.Schema(
  {
    quizTitle: String,
    quizDescription: String,
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    duration: Number, // Duration in minutes
    category: String,
    class: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Class",
      },
    ],
    backgroundColor: {
      type: String,
      default: "#FFFFFF",
    },
    wallpaper: {
      type: String,
      default: "", // URL or path to the wallpaper image
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Virtual field to get the count of questions
QuizSchema.virtual("questionCount").get(function () {
  return this.questions.length;
});

export default mongoose.model("Quiz", QuizSchema);
