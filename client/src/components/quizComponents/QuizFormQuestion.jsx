import { useEffect, useRef } from 'react';
import { FormRowSelect } from '..';
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';
import { QUESTION_TYPE } from '../../../../server/utils/constants';

const QuizFormQuestion = ({
	questionTypeOnChange,
	questionTypeValue,
	onQuestionTextChange,
	questionTextValue,
	uploadedImageUrl,
	questionIndex,
}) => {
	const editorRef = useRef(null);

	// INSERT IMAGE URL INTO EDITOR
	const insertImageIntoEditor = (imageUrl) => {
		if (editorRef.current) {
			const content = editorRef.current.getContent();
			if (!content.includes(imageUrl)) {
				// Check if the image URL is already in the content
				const imgTag = `<img src="${imageUrl}" alt="Uploaded Image"/>`;
				editorRef.current.insertContent(imgTag);
			}
			console.log('IMAGEURL: ', imageUrl);
		}
	};

	useEffect(() => {
		if (uploadedImageUrl) {
			insertImageIntoEditor(uploadedImageUrl);
		}
	}, []);

	// useEffect(() => {
	// 	if (uploadedImageUrl) {
	// 		insertImageIntoEditor(uploadedImageUrl);
	// 	}
	// }, [uploadedImageUrl]);

	// Transform QUESTION_TYPE object to array for FormRowSelect access
	const questionTypeOptions = Object.entries(QUESTION_TYPE).map(
		([value, label]) => ({
			value: value,
			label: label,
		})
	);

	// HANDLER
	const handleEditorChange = (content) => {
		// Sanitize the content
		// Extend DOMPurify configuration to allow iframes
		let cleanContent = DOMPurify.sanitize(content, {
			ADD_TAGS: ['iframe'],
			ADD_ATTR: [
				'allowfullscreen',
				'frameborder',
				'height',
				'width',
				'src',
			],
		}); // Update the question text in the parent component
		onQuestionTextChange(questionIndex, cleanContent);
	};

	return (
		<div className="flex flex-col justify-center align-middle">
			<div className="flex flex-col 2xl:flex-row md:mx-4 my-3">
				<FormRowSelect
					name="answerType"
					labelText="Question Type"
					list={Object.values(QUESTION_TYPE).map((type) => ({
						label: type.label,
						value: type.value,
					}))}
					onChange={questionTypeOnChange}
					value={questionTypeValue}
				/>
			</div>

			<div className="md:mx-4 my-6">
				<label htmlFor="questionText" className="text-lg ml-4 my-4">
					Question Text
				</label>
				<Editor
					onInit={(evt, editor) => {
						editorRef.current = editor;
					}}
					apiKey="eqgzlv5pjy49jlvt19f5xsydn4ft70ik3ol07ntoienablzn"
					key={`editor-${questionIndex}`}
					// Unique key for each editor instance
					value={String(questionTextValue)}
					init={{
						height: 500,
						selector: 'textarea',
						extended_valid_elements:
							'iframe[src|frameborder|allowfullscreen|width|height]',
						mobile: {
							theme: 'mobile',
							plugins: ['autosave', 'lists', 'autolink'],
							toolbar: ['undo', 'bold', 'italic', 'styleselect'],
						},
						menubar: true,
						content_style: `
						.responsive-iframe iframe {
							width: 100% !important;
							height: auto !important;
							aspect-ratio: 16 / 9 !important;
					}
					img { 
							max-width: 100%;
							height: auto;
					}`,
						directionality: 'ltr',
						plugins: [
							'image',
							'media',
							'table',
							'preview',
							'insertdatetime',
							'lists',
						],

						toolbar:
							'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | media code',
					}}
					onEditorChange={handleEditorChange}
				/>
			</div>
		</div>
	);
};

export default QuizFormQuestion;
