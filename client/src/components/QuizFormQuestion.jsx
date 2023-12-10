import { QUESTION_TYPE } from '../../../utils/constants';
import { FormRowSelect } from '.';
import { Editor } from '@tinymce/tinymce-react';

const QuizFormQuestion = ({
	questionTypeOnChange,
	questionTypeValue,
	onQuestionTextChange,
}) => {
	// Handler for TinyMCE content change
	const handleEditorChange = (content) => {
		onQuestionTextChange(content);
	};

	return (
		<div className="flex flex-col justify-center align-middle">
			<div className="flex flex-col 2xl:flex-row md:mx-4 my-3">
				<FormRowSelect
					name="answerType"
					labelText="Question Type"
					list={Object.values(QUESTION_TYPE)}
					onChange={questionTypeOnChange}
					value={questionTypeValue}
				/>
			</div>

			<div className="md:mx-4 my-6">
				<label htmlFor="questionText" className="text-lg ml-4 my-4">
					Question Text
				</label>
				<Editor
					apiKey="eqgzlv5pjy49jlvt19f5xsydn4ft70ik3ol07ntoienablzn"
					init={{
						height: 500,
						selector: 'textarea#mediaembed',
						menubar: true,
						plugins: [
							'link',
							'image',
							'media',
							'table',
							'code',
							'preview',
							'insertdatetime',
							'lists',
						],
						toolbar:
							'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | media code',
					}}
					onEditorChange={handleEditorChange}
				/>
			</div>
		</div>
	);
};

export default QuizFormQuestion;
