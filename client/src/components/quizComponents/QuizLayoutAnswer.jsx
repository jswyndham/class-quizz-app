import { Editor } from '@tinymce/tinymce-react';
import { QUESTION_TYPE } from '../../../../server/utils/constants';

const QuizLayoutAnswer = ({ index, answerType, answers, correctAnswer }) => {
	const isCorrect = answers === correctAnswer;

	// Multiple Choice Answer
	const renderMultipleChoiceAnswer = () => (
		<li
			key={index}
			className="relative my-14 sm:my-12 md:my-10 flex items-center"
		>
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
		<Editor
			apiKey="eqgzlv5pjy49jlvt19f5xsydn4ft70ik3ol07ntoienablzn"
			init={{
				height: 500,
				menubar: false,
				mobile: {
					theme: 'mobile',
					plugins: ['autosave', 'lists', 'autolink'],
					toolbar: ['undo', 'bold', 'italic', 'styleselect'],
				},
				plugins: ['preview', 'insertdatetime', 'lists'],
				toolbar:
					'undo redo | formatselect | ' +
					'bold italic backcolor | alignleft aligncenter ' +
					'alignright alignjustify | bullist numlist outdent indent | ' +
					'removeformat | help',
			}}
			onEditorChange={(content) => {
				console.log('Content was updated:', content);
			}}
		/>
	);

	return (
		<div>
			{answerType === QUESTION_TYPE.MULTIPLE_CHOICE.value
				? renderMultipleChoiceAnswer()
				: null}
			{answerType === QUESTION_TYPE.LONG_ANSWER.value
				? renderLongAnswer()
				: null}
		</div>
	);
};

export default QuizLayoutAnswer;
