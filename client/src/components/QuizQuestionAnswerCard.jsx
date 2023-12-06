import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { QUESTION_TYPE } from '../../../utils/constants';

const QuizQuestionAnswerCard = ({
	index,
	answerType,
	answers,
	correctAnswer,
}) => {
	const isCorrect = answers === correctAnswer;

	// Multiple Choice Answer
	const renderMultipleChoiceAnswer = () => (
		<li key={index} className="relative my-8 flex items-center">
			<input
				id={index}
				type="radio"
				value={answers}
				checked={isCorrect}
				readOnly
				name="default-radio"
				className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
			/>

			<div className="absolute ms-8 w-11/12 h-fit bg-amber-50 py-1 px-3">
				<label
					htmlFor="default-radio-2"
					className="text-xl font-medium text-gray-900 dark:text-gray-300"
				>
					{answers}
				</label>
			</div>
		</li>
	);

	// Long Answer
	const renderLongAnswer = () => (
		<ReactQuill
			theme="snow"
			onChange={(content, delta, source, editor) => {
				console.log(editor.getHTML()); // rich text
				console.log(editor.getText()); // plain text
			}}
		/>
	);

	// const answerType = QUESTION_TYPE.LONG_ANSWER;
	// console.log('Rendering type: ', answerType);

	return (
		<div>
			{answerType === QUESTION_TYPE.MULTIPLE_CHOICE
				? renderMultipleChoiceAnswer()
				: null}
			{answerType === QUESTION_TYPE.LONG_ANSWER
				? renderLongAnswer()
				: null}
		</div>
	);
};

export default QuizQuestionAnswerCard;
