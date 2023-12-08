import { Form } from "react-router-dom";
import { FormRow, QuizFormAnswer, QuizFormQuestion } from ".";
import { useNavigation } from "react-router-dom";
import { useState } from "react";

const QuizForm = ({
  onSubmit,
  quizTitleRow,
  quizTitleValue,
  quizTitleDefault,
}) => {
  const [questions, setQuestions] = useState([]);

  const addNewQuestion = () => {
    const newQuestion = {
      questionText: "",
      answerType: "", // Default answer type if any
      options: [], // Empty array for options
      correctAnswer: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  // const updateQuestionProperty = (index, property, value) => {
  //   const updatedQuestions = questions.map((q, i) => {
  //     if (i === index) {
  //       return { ...q, [property]: value };
  //     }
  //     return q;
  //   });
  //   setQuestions(updatedQuestions);
  // };

  // const updateQuestion = (index, updatedQuestion) => {
  //   const updatedQuestions = questions.map((q, i) =>
  //     i === index ? updatedQuestion : q
  //   );
  //   setQuestions(updatedQuestions);
  // };

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <div className="flex justify-center align-middle w-full h-screen">
      <Form
        method="post"
        onSubmit={onSubmit}
        className="flex flex-col items-center drop-shadow-lg w-full mx-6 my-4 lg:w-10/12 xl:w-7/12 2xl:w-5/12"
      >
        <div className="flex flex-col w-full mx-2 my-1">
          <div className="w-full mx-4 my-2">
            <FormRow
              type="text"
              name="quizTitle"
              labelText="Quiz Title"
              placeholder="quiz title"
              onChange={quizTitleRow}
              value={quizTitleValue}
              defaultValue={quizTitleDefault}
            />
          </div>

          <div className="flex flex-col justify-center align-middle border border-slate-400 p-6 my-4">
            <QuizFormQuestion
            // questionTypeOnChange={questionText}
            // questionTypeValue={question.answerType}
            // questionTypeDefault={(content) =>
            //   updateQuestionProperty(index, "questionText", content)
            // }
            // answerTypeOnChange={(e) =>
            //   updateQuestionProperty(index, "answerType", e.target.value)
            // }
            />

            <QuizFormAnswer
            // key={index}
            // index={index}
            // answerType={question.answerType}
            // answers={option.optionText}
            // correctAnswer={question.correctAnswer}
            />
            <QuizFormAnswer
            // key={index}
            // index={index}
            // answerType={question.answerType}
            // answers={option.optionText}
            // correctAnswer={question.correctAnswer}
            />
          </div>
        </div>
        <div className="flex flex-col 2xl:flex-row mx-4">
          <button
            type="submit"
            onClick={addNewQuestion}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isSubmitting ? "submitting..." : "create"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default QuizForm;
