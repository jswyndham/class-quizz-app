import { StatusCodes } from "http-status-codes";
import sanitizeHtml from "sanitize-html";
import Quiz from "../models/QuizModel.js";

// Configuration for HTML sanitization
const sanitizeConfig = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["iframe", "img"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
    img: ["src", "alt"],
  },

  // Custom transformations for specific tags
  transformTags: {
    iframe: (tagName, attribs) => {
      // Regex to validate YouTube URLs in iframe
      // Regular expression to match YouTube URL in iframe src
      const iframeRegex =
        /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/embed\/[\w-]+(\?.*)?$/;
      if (attribs.src && iframeRegex.test(attribs.src)) {
        return {
          tagName: "iframe",
          attribs: {
            src: attribs.src,
            width: attribs.width || "560",
            height: attribs.height || "315",
            frameborder: attribs.frameborder || "0",
            allowfullscreen: attribs.allowfullscreen || "",
          },
        };
      }
      return {
        tagName: "p",
        text: "(Video removed for security reasons)",
      };
    },
    img: (tagName, attribs) => {
      // Regular expression to match jpg and png image URLs
      const dataUrlRegex = /^data:image\/(png|jpeg|jpg);base64,/;
      const imageUrlRegex = /\.(jpg|jpeg|png)$/i;

      // Check if the src attribute of the img tag matches allowed formats
      if (
        attribs.src &&
        (dataUrlRegex.test(attribs.src) || imageUrlRegex.test(attribs.src))
      ) {
        // Return the img tag with its attributes if it matches the criteria
        return {
          tagName: "img",
          attribs: {
            src: attribs.src,
            alt: attribs.alt || "",
          },
        };
      }
      return {
        tagName: "p",
        text: "(Image removed for security reasons)",
      };
    },
  },
};

// Controller to get all quizzes by user
export const getAllQuizzes = async (req, res) => {
  try {
    // Find all quizzes by user
    const allQuizzes = await Quiz.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({ allQuizzes });
  } catch (error) {
    console.error("Error finding all quizzes:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller to get a single quiz
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.status(StatusCodes.OK).json({ quiz });
  } catch (error) {
    console.error("Error finding quiz:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller to create a new quiz
export const createQuiz = async (req, res) => {
  try {
    // Set the creator of the quiz
    req.body.createdBy = req.user.userId;

    // Sanitize and prepare questions data
    if (req.body.questions && req.body.questions.length > 0) {
      req.body.questions = req.body.questions.map((question) => {
        const correctOption = question.options.find(
          (option) => option.isCorrect
        );
        return {
          ...question,
          questionText: sanitizeHtml(question.questionText, sanitizeConfig),
          correctAnswer: correctOption ? correctOption.optionText : null,
        };
      });
    }

    // Create and store the new quiz
    const quiz = await Quiz.create(req.body);
    return res.status(StatusCodes.CREATED).json({ quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller to update an existing quiz
export const updateQuiz = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Sanitize and update questions data
    if (updateData.questions && updateData.questions.length > 0) {
      updateData.questions = updateData.questions.map((question) => {
        const correctOption = question.options.find(
          (option) => option.isCorrect
        );
        return {
          ...question,
          questionText: sanitizeHtml(question.questionText, sanitizeConfig),
          correctAnswer: correctOption ? correctOption.optionText : null,
        };
      });
    }

    // Update and return the modified quiz
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.status(StatusCodes.OK).json({
      msg: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};

// Controller to delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({
      msg: "Quiz deleted",
      quiz: quiz,
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Controller to add a question to a quiz
export const addQuestionToQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const questionData = { ...req.body };

    // Sanitize question and option texts
    if (questionData.questionText) {
      questionData.questionText = sanitizeHtml(
        questionData.questionText,
        sanitizeConfig
      );
    }

    // Sanitize options and set correct answer
    if (questionData.options) {
      questionData.options = questionData.options.map((option, index) => ({
        ...option,
        optionText: sanitizeHtml(option.optionText, sanitizeConfig),
        isCorrect: index === questionData.correctAnswer,
      }));
    }

    // Update quiz with the new question
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $push: { questions: questionData } },
      { new: true, runValidators: true }
    );

    if (!updatedQuiz) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Quiz not found" });
    }

    res.status(StatusCodes.OK).json({
      msg: "Question added",
      quiz: updatedQuiz,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};
