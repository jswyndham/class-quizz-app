import { useEffect, useRef } from 'react';
import { QUESTION_TYPE } from '../../../utils/constants';
import { FormRowSelect } from '.';
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';

const QuizFormQuestion = ({
	questionTypeOnChange,
	questionTypeValue,
	onQuestionTextChange,
	uploadedImageUrl,
}) => {
	const editorRef = useRef(null);

	// INSERT IMAGE URL INTO EDITOR
	const insertImageIntoEditor = (imageUrl) => {
		if (editorRef.current) {
			const imgTag = `<img src="${imageUrl}" alt="Uploaded Image"/>`;
			editorRef.current.insertContent(imgTag);
		}
	};

	useEffect(() => {
		if (uploadedImageUrl) {
			insertImageIntoEditor(uploadedImageUrl);
		}
	}, [uploadedImageUrl]);

	const handleEditorChange = (content) => {
		// Create a new HTML document fragment
		let doc = new DOMParser().parseFromString(content, 'text/html');

		// Find all iframes in the content
		let iframes = doc.querySelectorAll('iframe');

		// Wrap each iframe with the responsive container
		iframes.forEach((iframe) => {
			let wrapper = doc.createElement('div');
			wrapper.className = 'responsive-iframe';
			iframe.parentNode.insertBefore(wrapper, iframe);
			wrapper.appendChild(iframe);
		});

		// Convert the updated document back to a string
		let newContent = doc.body.innerHTML;

		// Clean the content using DOMPurify to prevent XSS attacks
		let cleanContent = DOMPurify.sanitize(newContent);

		// Call the original change handler with the updated content
		onQuestionTextChange(cleanContent);
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
					onInit={(evt, editor) => (editorRef.current = editor)}
					apiKey="eqgzlv5pjy49jlvt19f5xsydn4ft70ik3ol07ntoienablzn"
					init={{
						height: 500,
						selector: 'textarea#mediaembed',
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
  `,
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
