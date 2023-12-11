import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizById } from "../features/quiz/quizAPI";
import { useParams } from "react-router-dom";
import { PiDotsThreeBold } from "react-icons/pi";
import { QuizLayoutQuestion, QuizLayoutAnswer } from "../components";
import { QUESTION_TYPE } from "../../../utils/constants";

const QuizLayout = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentQuiz = useSelector((state) => state.quiz.currentQuiz);
  const { loading, error } = useSelector((state) => state.class);
  const menuRef = useRef();

  useEffect(
    () => {
      dispatch(fetchQuizById(id));
    },
    [dispatch, id],
    id
  );

  if (!currentQuiz) {
    return <div>Loading quiz...</div>; // or any other placeholder content
  }
  if (loading) return <div>Loading class...</div>;
  if (error) return <div>Error: {error}</div>;

  // if (currentQuiz === 0) {
  // 	return (
  // 		<div className="h-screen w-screen flex justify-center">
  // 			<h2 className="text-3xl font-display font-bold italic mt-44">
  // 				No questions created, yet.
  // 			</h2>
  // 		</div>
  // 	);
  // }

  return (
    <section className="w-screen h-screen flex flex-col justify-center align-middle">
      <div className="mt-56">
        <h2 className="text-4xl font-serif text-blue-800 text-center">
          {currentQuiz.quizTitle}
        </h2>
      </div>
      <article className="w-screen h-screen flex justify-center">
        <div className="flex flex-col justify-center items-center w-full lg:w-3/4 h-fit p-1 lg:p-6 lg:m-6 border border-slate-300 rounded-md  drop-shadow-xl shadow-lg shadow-slate-400">
          {currentQuiz.questions.map((question) => (
            <div
              key={question._id}
              className="w-full lg:w-11/12 my-6 border border-slate-400 rounded-sm"
            >
              <QuizLayoutQuestion
                points={question.points}
                question={question.questionText}
              />

              <ol className="p-6 text-xl">
                {question.answerType === QUESTION_TYPE.MULTIPLE_CHOICE
                  ? question.options.map((option, index) => (
                      <QuizLayoutAnswer
                        key={index}
                        index={index}
                        answerType={question.answerType}
                        answers={option.optionText}
                        correctAnswer={question.correctAnswer}
                      />
                    ))
                  : question.answerType === QUESTION_TYPE.LONG_ANSWER && (
                      <QuizLayoutAnswer answerType={question.answerType} />
                    )}
              </ol>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
};

export default QuizLayout;
