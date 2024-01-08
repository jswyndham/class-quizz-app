const QuizFormColorSelector = ({ selectedColor, onSelectColor }) => {
	const gradients = [
		{ name: 'Blue', class: 'gradient-blue', value: '#007bff' },
		{ name: 'Green', class: 'gradient-green', value: '#28a745' },
		{ name: 'Red', class: 'gradient-red', value: '#dc3545' },
		{ name: 'Pink', class: 'gradient-pink', value: '#f472b6' },
		{ name: 'Purple', class: 'gradient-purple', value: '#a78bfa' },
		{ name: 'Orange', class: 'gradient-orange', value: '#bb976d' },
	];

	return (
		<div className="flex justify-center items-center">
			{gradients.map((gradient) => (
				<div
					key={gradient.value}
					className={`color-option ${gradient.class}`}
					onClick={() => onSelectColor(gradient.value)}
					style={{
						outline:
							selectedColor === gradient.value
								? '2px solid black'
								: '',
					}}
				/>
			))}
		</div>
	);
};

export default QuizFormColorSelector;
