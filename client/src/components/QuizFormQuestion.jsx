import { QUESTION_TYPE } from '../../../utils/constants';
import { FormRow, FormRowSelect } from '.';

const QuizFormQuestion = ({
	questionTextRow,
	answerTypeRow,
	answerRow,
	questionTextValue,
	answerTypeValue,
	answerValue,
	questionTextDefault,
	answerTypeDefault,
	answerDefault,
}) => {
	return (
		<div className="flex flex-col justify-center align-middle border border-slate-400 p-6">
			<div className="flex flex-col 2xl:flex-row mx-4 my-1">
				<FormRowSelect
					name="answerType"
					labelText="Question Type"
					list={Object.values(QUESTION_TYPE)}
					onChange={answerTypeRow}
					value={answerTypeValue}
					defaultValue={answerTypeDefault}
				/>
			</div>

			<div className="mx-4 my-2">
				<FormRow
					type="text"
					labelText="Question Text"
					name="questionText"
					onChange={questionTextRow}
					value={questionTextValue}
					defaultValue={questionTextDefault}
				/>
			</div>
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
		</div>
	);
};

export default QuizFormQuestion;
