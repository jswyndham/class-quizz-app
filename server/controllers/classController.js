import ClassGroup from "../models/ClassModel.js";
import { StatusCodes } from "http-status-codes";

// Controller to retrieve all classes
export const getAllClasses = async (req, res) => {
  try {
    const classGroups = await ClassGroup.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({ classGroups });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller to create new class
export const createClass = async (req, res) => {
  try {
    // Set the user as the creator of the class
    req.body.createdBy = req.user.userId;
    const classGroup = await ClassGroup.create(req.body);
    return res.status(StatusCodes.CREATED).json({ classGroup });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller to retrieve a single class
export const getClass = async (req, res) => {
  try {
    // Find the class group by ID and populate its quizzes parameter
    const classGroup = await ClassGroup.findById(req.params.id)
      .populate({
        path: "quizzes",
        match: { class: { $in: [req.params.id] } }, // Check if class ID is in the array
      })
      .exec();

    if (!classGroup) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Class not found" });
    }

    // strict filtering
    if (req.query.includeQuizzes === "true") {
      classGroup.quizzes = classGroup.quizzes.filter((quiz) =>
        quiz.class.some((classId) => classId.toString() === req.params.id)
      );
    }

    res
      .status(StatusCodes.OK)
      .json({ class: classGroup, msg: "Class was found" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller to update a class by ID
export const updateClass = async (req, res) => {
  try {
    const updatedClass = await ClassGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(StatusCodes.OK).json({
      msg: "Class was updated",
      class: updatedClass,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller to delete class by ID
export const deleteClass = async (req, res) => {
  try {
    // Delete the class group by ID
    const removedClass = await ClassGroup.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({
      msg: "Class was deleted",
      class: removedClass,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// A controller to allow students to join a class.
export const joinClass = async (req, res) => {
  const classId = req.params.id;
  const userId = req.user.userId;

  try {
    // Add student to the class
    const updatedClass = await ClassGroup.findByIdAndUpdate(
      classId,
      // The $addToSet operator is used to add a value to an array only if the value does not already exist in the array.
      { $addToSet: { students: userId } },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Class not found" });
    }

    res.status(StatusCodes.OK).json({ msg: "Joined class successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
