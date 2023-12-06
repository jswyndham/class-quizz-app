const QuizQuestionCard = ({ question }) => {
	return (
		<div className="w-full h-fit bg-blue-100 ">
			<h3 className="text-3xl p-5">{question}</h3>
		</div>
	);
};

export default QuizQuestionCard;
