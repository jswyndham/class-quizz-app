import { FormRow } from ".";
import { TiDelete } from "react-icons/ti";

const QuizFormAnswer = ({
  onOptionTextChange,
  optionTextValue,
  index,
  questionIndex,
  setCorrectAnswer,
  onRadioChange,
  checkedIsCorrect,
  handleRadioChange,
  onDelete,
}) => {
  // HANDLE CHANGES TO THE RADIO BUTTON
  // const handleRadioChange = (questionIndex, optionIndex) => {
  //   setCorrectAnswer(questionIndex, optionIndex);
  // };

  return (
    <div className="flex flex-col md:px-4 bg-primary my-2 drop-shadow-xl border border-slate-300">
      <ul className="text-xl">
        <li className="flex flex-row justify-center align-middle ">
          <input
            id={`${questionIndex}-${index}`}
            type="radio"
            checked={checkedIsCorrect}
            onChange={onRadioChange}
            name={`correct answer-${questionIndex}`}
            className="w-5 h-5 mt-14 mx-2 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <div className="w-full m-2">
            <FormRow
              type="text"
              name="optionText"
              labelText="Answer"
              onChange={onOptionTextChange}
              value={optionTextValue}
            />
          </div>
          <div
            onClick={onDelete}
            className="mt-2 -ml-10 mr-2 text-3xl text-red-600 hover:cursor-pointer hover:text-red-700"
          >
            <TiDelete />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default QuizFormAnswer;
