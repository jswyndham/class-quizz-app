import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: mongoose.Schema.Types.ObjectId,
  selectedOption: String, // results of multiple choice answers
  responseText: String, // results of short and long answers
  manualScore: {
    type: Number,
    default: 0, // Manual score assigned by a teacher for subjective questions
  },
  isScored: {
    type: Boolean,
    default: false, // Indicates if the answer has been manually scored
  },
});

const QuizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [answerSchema],
    score: {
      type: Number,
      default: 0, // For automatic scoring or final calculated score
    },
    completed: {
      type: Boolean,
      default: false,
    },
    isFullyScored: {
      type: Boolean,
      default: false, // Indicates whether all subjective questions have been scored
    },
  },
  { timestamps: true }
);

export default mongoose.model("QuizAttempt", QuizAttemptSchema);
