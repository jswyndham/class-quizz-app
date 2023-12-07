const QuizQuestionCard = ({ points, question }) => {
  return (
    <div className="w-full h-fit bg-blue-100">
      <div className="flex flex-row-reverse  pt-3 pr-6">
        <p className="text-lg italic">
          {points} {points === 1 ? "point" : "points"}
        </p>
      </div>
      <div>
        <h3 className="text-3xl pb-4 px-8">{question}</h3>
      </div>
    </div>
  );
};

export default QuizQuestionCard;
