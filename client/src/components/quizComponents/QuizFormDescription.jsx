import { useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';

const QuizFormDescription = ({
	onChangeDescription,
	descriptionValue,
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
		});
		onChangeDescription(cleanContent);
	};

	return (
		<div className="flex flex-col justify-center align-middle">
			<div className="md:mx-4 my-6">
				<Editor
					onInit={(evt, editor) => {
						editorRef.current = editor;
					}}
					apiKey="eqgzlv5pjy49jlvt19f5xsydn4ft70ik3ol07ntoienablzn"
					// Unique key for each editor instance
					value={String(descriptionValue)}
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

export default QuizFormDescription;
