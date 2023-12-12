const QuizLayoutQuestion = ({ points, question }) => {
  return (
    <div className="w-full h-fit bg-blue-100">
      <div className="flex flex-row-reverse  pt-3 pr-6">
        <p className="text-lg italic">
          {points} {points === 1 ? "point" : "points"}
        </p>
      </div>
      <div>
        <div
          className="text-3xl pb-4 px-2 lg:px-8 responsive-iframe"
          dangerouslySetInnerHTML={{ __html: question }}
        />
      </div>
    </div>
  );
};

export default QuizLayoutQuestion;
