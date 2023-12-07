import { Form } from 'react-router-dom';
import { QUESTION_TYPE } from '../../../utils/constants';
import { FormRow, FormRowSelect } from '.';
import { useNavigation } from 'react-router-dom';
import QuizFormQuestion from './QuizFormQuestion';

const QuizForm = ({
	onSubmit,
	quizTitleRow,
	questionTextRow,
	answerTypeRow,
	schoolRow,
	quizTitleValue,
	questionTextValue,
	answerTypeValue,
	schoolValue,
	quizTitleDefault,
	questionTextDefault,
	answerTypeDefault,
	schoolDefault,
}) => {
	const navigation = useNavigation();
	const isSubmitting = navigation.state === 'submitting';
	return (
		<div className="flex justify-center align-middle w-full">
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
					<div className="my-4">
						<QuizFormQuestion />
					</div>
				</div>
				<div className="flex flex-col 2xl:flex-row mx-4">
					<button
						type="submit"
						className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						{isSubmitting ? 'submitting...' : 'create'}
					</button>
				</div>
			</Form>
		</div>
	);
};

export default QuizForm;
