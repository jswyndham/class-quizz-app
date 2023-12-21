import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import ClassGroup from "../models/ClassModel.js";

// Controller to get the current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    const userWithoutPassword = user.toJSON();

    // Send user details excluding the password
    res.status(StatusCodes.OK).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Error finding current user:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller to get application statistics
export const getApplicationStats = async (req, res) => {
  try {
    // Count the total number of users in the database
    const users = await User.countDocuments();

    // Count the total number of classes in the database
    const classGroup = await ClassGroup.countDocuments();

    // Count the total number of quizzes in the database
    const quizzes = await Quiz.countDocuments();
    res.status(StatusCodes.OK).json({ users, classGroup, quizzes });
  } catch (error) {
    console.error("Error finding application stats:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller to update the current user
export const updateUser = async (req, res) => {
  try {
    // Clone the request body to modify
    const obj = { ...req.body };

    // Exclude password in user info request
    delete obj.password;

    const updatedUser = await User.findByIdAndUpdate(req.user.userId, obj);
    res.status(StatusCodes.OK).json({ update: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
