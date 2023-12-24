import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    studentNumber: Number,
    class: {
      type: mongoose.Types.ObjectId,
      ref: "Class",
    },
    student: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    classMember: Boolean,
  },
  { timestamps: true }
);

StudentSchema.index({ class: 1, student: 1 }, { unique: true });

export default mongoose.model("Student", StudentSchema);
