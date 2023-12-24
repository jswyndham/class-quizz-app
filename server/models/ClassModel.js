import mongoose from "mongoose";
import { CLASS_STATUS } from "../utils/constants.js";

const ClassSchema = new mongoose.Schema(
  {
    className: String,

    subject: String,
    school: String,
    classStatus: {
      type: String,
      enum: Object.values(CLASS_STATUS),
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
    },
    quizzes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Quiz",
        index: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Class", ClassSchema);
