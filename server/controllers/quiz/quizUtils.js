import sanitizeHtml from 'sanitize-html';

// Configuration for HTML sanitization
const sanitizeConfig = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe', 'img']),
	allowedAttributes: {
		...sanitizeHtml.defaults.allowedAttributes,
		iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
		img: ['src', 'alt'],
	},

	// Custom transformations for specific tags that are allowed to be shown in the tinyMCE editor. This has been done to tighten security and sanitation regarding what is accepted by the rich text editor.
	transformTags: {
		iframe: (tagName, attribs) => {
			// YOUTUBE
			// Regex to validate YouTube URLs in iframe
			// Two expressions are used to match YouTube URL in iframe src
			const iframeRegex =
				/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/embed\/[\w-]+(\?.*)?$/;
			if (attribs.src && iframeRegex.test(attribs.src)) {
				return {
					tagName: 'iframe',
					attribs: {
						src: attribs.src,
						width: attribs.width || '560',
						height: attribs.height || '315',
						frameborder: attribs.frameborder || '0',
						allowfullscreen: attribs.allowfullscreen || '',
					},
				};
			}
			return {
				tagName: 'p',
				text: '(Video removed for security reasons)',
			};
		},
		img: (tagName, attribs) => {
			// IMAGES
			// Regular expression to match jpg and png image URLs
			const dataUrlRegex = /^data:image\/(png|jpeg|jpg);base64,/;
			const imageUrlRegex = /\.(jpg|jpeg|png)$/i;

			// Check if the src attribute of the img tag matches allowed formats
			if (
				attribs.src &&
				(dataUrlRegex.test(attribs.src) ||
					imageUrlRegex.test(attribs.src))
			) {
				// Return the img tag with its attributes if it matches the criteria
				return {
					tagName: 'img',
					attribs: {
						src: attribs.src,
						alt: attribs.alt || '',
					},
				};
			}
			return {
				tagName: 'p',
				text: '(Image removed for security reasons)',
			};
		},
	},
};

export default sanitizeConfig;
