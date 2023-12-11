import Quiz from "../models/QuizModel.js";
import { StatusCodes } from "http-status-codes";
import sanitizeHtml from "sanitize-html";

// GET ALL QUIZZES
export const getAllQuizzes = async (req, res) => {
  const allQuizzes = await Quiz.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ allQuizzes });
};

// CREATE QUIZ
export const createQuiz = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;

    if (req.body.questions && req.body.questions.length > 0) {
      req.body.questions = req.body.questions.map((question) => {
        const sanitizedQuestionText = sanitizeHtml(question.questionText, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "img",
            "iframe",
          ]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "alt"],
            iframe: [
              "src",
              "width",
              "height",
              "frameborder",
              "allowfullscreen",
            ],
          },
        });

        return {
          ...question,
          questionText: sanitizedQuestionText,
          options: question.options.map((option) => ({
            ...option,
            optionText: sanitizeHtml(option.optionText),
          })),
        };
      });
    }

    const quiz = await Quiz.create(req.body);
    return res.status(StatusCodes.CREATED).json({ quiz });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};

// GET SINGLE QUIZ
export const getQuiz = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  res.status(StatusCodes.OK).json({ quiz });
};

// UPDATE QUIZ
export const updateQuiz = async (req, res) => {
  try {
    if (req.body.questions && req.body.questions.length > 0) {
      req.body.questions = req.body.questions.map((question) => {
        const sanitizedQuestionText = sanitizeHtml(question.questionText, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "img",
            "iframe",
          ]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "alt"],
            iframe: [
              "src",
              "width",
              "height",
              "frameborder",
              "allowfullscreen",
            ],
          },
        });

        return {
          ...question,
          questionText: sanitizedQuestionText,
          options: question.options.map((option) => ({
            ...option,
            optionText: sanitizeHtml(option.optionText), // Sanitize options if necessary
          })),
        };
      });
    }

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(StatusCodes.OK).json({
      msg: "Quiz updated",
      quiz,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};

// DELETE QUIZ
export const deleteQuiz = async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({
    msg: "Quiz deleted",
    quiz: quiz,
  });
};

// ADD QUESTIONS
export const addQuestionToQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    if (req.body.questionText) {
      req.body.questionText = sanitizeHtml(req.body.questionText, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "img",
          "iframe",
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ["src", "alt"],
          iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
        },
      });
    }

    if (req.body.options) {
      req.body.options = req.body.options.map((option) => ({
        ...option,
        optionText: sanitizeHtml(option.optionText), // Sanitize options if necessary
      }));
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $push: { questions: req.body } },
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
