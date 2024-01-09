// Defines the color value and returns the gradient in the css
const QuizCardGradientValues = () => {
	const determineGradientClass = (colorValue) => {
		switch (colorValue) {
			case '#007bff':
				return 'gradient-blue';
			case '#28a745':
				return 'gradient-green';
			case '#dc3545':
				return 'gradient-red';
			case '#f472b6':
				return 'gradient-pink';
			case '#a78bfa':
				return 'gradient-purple';
			case '#bb976d':
				return 'gradient-orange';
			default:
				return ''; // default case if needed
		}
	};

	return {
		determineGradientClass,
	};
};

export default QuizCardGradientValues;
