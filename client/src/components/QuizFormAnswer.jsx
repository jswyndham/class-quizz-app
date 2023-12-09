import { FormRow } from '.';
import { TiDelete } from 'react-icons/ti';

const QuizFormAnswer = ({
	answerRow,
	answerValue,
	answerDefault,
	index,
	questionIndex,
	setCorrectAnswer,
	isCorrect,
	deleteClick,
}) => {
	const handleRadioChange = () => {
		setCorrectAnswer(questionIndex, index); // Function to update correct answer in the parent state
	};

	return (
		<div className="flex flex-col md:px-4 bg-primary my-2">
			<ul className="text-xl">
				<li className="flex flex-row justify-center align-middle ">
					<input
						id={`${questionIndex} - ${index}`}
						type="radio"
						checked={isCorrect}
						onChange={handleRadioChange}
						name={`correct answer: ${questionIndex}`}
						className="w-5 h-5 mt-14 mx-2 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
					/>
					<div className="w-full m-2">
						<FormRow
							type="text"
							name="optionText"
							labelText="Answer"
							onChange={answerRow}
							value={answerValue}
							defaultValue={answerDefault}
						/>
					</div>
					<div
						onClick={deleteClick}
						className="mt-14 -ml-6 mr-1 text-3xl text-red-600 hover:cursor-pointer hover:text-red-700"
					>
						<TiDelete />
					</div>
				</li>
			</ul>
		</div>
	);
};

export default QuizFormAnswer;
