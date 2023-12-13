import { Form } from "react-router-dom";
import { QuizFormAnswer, QuizFormQuestion } from ".";
import QuizHooks from "../hooks/QuizHooks";
import { useNavigate, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createQuiz } from "../features/quiz/quizAPI";
import { uploadCloudinaryFile } from "../features/cloudinary/cloudinarySlice";

const QuizForm = () => {
  // STATE HOOKS
  const {
    quiz,
    selectedFile,
    setSelectedFile,
    setQuizTitle,
    updateQuestion,
    addNewQuestion,
    addOptionToQuestion,
    updateAnswerType,
    updateOption,
    deleteOption,
  } = QuizHooks({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // ADD QUIZ TITLE
  const handleQuizTitleChange = (e) => {
    setQuizTitle(e.target.value);
  };

  // ADD QUESTION TEXT
  const updateQuestionText = (questionIndex, newText) => {
    const updatedQuestion = {
      ...quiz.questions[questionIndex],
      questionText: newText,
    };
    updateQuestion(questionIndex, updatedQuestion);
  };

  // UPLOAD FILE TO CLOUDINARY
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // ADD NEW QUESTION
  const handleAddNewQuestion = () => {
    addNewQuestion();
  };

  // ADD NEW OPTION (ANSWER) TO QUESTION
  const handleAddOption = (questionIndex) => {
    addOptionToQuestion(questionIndex);
  };

  // ADD OPTION (ANSWER) TEXT
  const handleOptionTextChange = (questionIndex, optionIndex, e) => {
    const updatedOption = {
      ...quiz.questions[questionIndex].options[optionIndex],
      optionText: e.target.value,
    };
    updateOption(questionIndex, optionIndex, updatedOption);
  };

  // DELETE OPTION
  const handleDeleteOption = (questionIndex, optionIndex) => {
    deleteOption(questionIndex, optionIndex);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("The quiz object 1: ", { quiz });
    try {
      await dispatch(createQuiz(quiz)).unwrap();
      console.log("The quiz object 2: ", { quiz });
      navigate("/dashboard/all-quizzes");
      toast.success("Quiz successfully added");
    } catch (error) {
      console.error("Failed to create quiz:", error);
      toast.error("Failed to create quiz");
    }
  };

  return (
    <div className="flex justify-center align-middle w-screen h-fit">
      <Form
        method="post"
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center drop-shadow-lg w-full m-3 md:mx-5 my-4 lg:w-10/12 xl:w-max"
      >
        <div className="flex flex-col justify-center w-full md:mx-2 my-1">
          <label htmlFor="questionText" className="text-lg ml-4 my-4">
            Quiz Title
          </label>
          <div>
            <input
              type="text"
              name="quizTitle"
              value={quiz.quizTitle}
              onChange={handleQuizTitleChange}
              placeholder="Quiz Title"
              className="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          {quiz.questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="flex flex-col justify-center align-middle bg-slate-100 lg:border border-slate-400 lg:p-6 my-4"
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="your-custom-styles"
              />
              <QuizFormQuestion
                questionTextValue={question.questionText}
                questionTypeValue={question.answerType}
                questionTypeOnChange={(e) =>
                  updateAnswerType(questionIndex, e.target.value)
                }
                onQuestionTextChange={(updatedText) =>
                  updateQuestionText(questionIndex, updatedText)
                }
              />

              {question.options.map((option, optionIndex) => (
                <QuizFormAnswer
                  key={optionIndex}
                  optionTextValue={option.optionText}
                  onOptionTextChange={(newText) =>
                    handleOptionTextChange(questionIndex, optionIndex, newText)
                  }
                  onDelete={() =>
                    handleDeleteOption(questionIndex, optionIndex)
                  }
                />
              ))}
              <button
                type="button"
                onClick={() => handleAddOption(questionIndex)}
              >
                Add Option
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddNewQuestion}
            className="flex justify-center w-8/12 p-6 text-xl bg-secondary border border-slate-500 rounded-lg shadow-lg shadow-slate-300"
          >
            Add New Question
          </button>
        </div>
        {/* SUBMIT FORM */}
        <div className="flex justify-center w-8/12 mx-4 my-12">
          <button
            type="submit"
            className="w-1/3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isSubmitting ? "submitting..." : "create"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default QuizForm;
