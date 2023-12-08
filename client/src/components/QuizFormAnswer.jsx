import { FormRow } from ".";

const QuizFormAnswer = ({
  answerRow,
  answerValue,
  answerDefault,
  index,
  correctAnswer,
  isCorrect,
}) => {
  return (
    <div className="flex flex-col justify-center align-middle border border-slate-400 p-6">
      <ul className="p-6 text-xl">
        <li>
          <input
            id={index}
            type="radio"
            value={correctAnswer}
            checked={isCorrect}
            name="default-radio"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <div className="mx-4 my-2">
            <FormRow
              type="text"
              name="optionText"
              labelText="Answer"
              onChange={answerRow}
              value={answerValue}
              defaultValue={answerDefault}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default QuizFormAnswer;
