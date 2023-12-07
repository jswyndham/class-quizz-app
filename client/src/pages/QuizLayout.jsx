import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizById } from "../features/quiz/quizAPI";
import { useParams } from "react-router-dom";
import { PiDotsThreeBold } from "react-icons/pi";
import QuizQuestionCard from "../components/QuizQuestionCard";
import QuizQuestionAnswerCard from "../components/QuizQuestionAnswerCard";
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

  if (loading) return <div>Loading class...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!currentQuiz) {
    return (
      <div className="h-screen w-screen flex justify-center">
        <h2 className="text-3xl font-display font-bold italic mt-44">
          No questions created, yet.
        </h2>
      </div>
    );
  }

  return (
    <section className="w-screen h-screen flex flex-col justify-center align-middle">
      <div className="mt-56">
        <h2 className="text-4xl font-serif text-blue-800 text-center">
          {currentQuiz.quizTitle}
        </h2>

        <div className="absolute w-14 h-8 right-8 top-40 bg-black bg-opacity-40 rounded-md">
          <button
            ref={menuRef}
            className="absolute z-10 text-white -mt-2 ml-1 text-5xl font-bold hover:cursor-pointer"
            // onClick={handleMenuClick}
          >
            <PiDotsThreeBold />
          </button>
        </div>
      </div>
      <article className="w-screen h-screen flex justify-center">
        <div className="flex flex-col justify-center items-center w-3/4 h-fit p-6 m-6 border border-slate-300 rounded-md  drop-shadow-xl shadow-lg shadow-slate-400">
          {currentQuiz.questions.map((question) => (
            <div
              key={question._id}
              className="w-11/12 my-6 border border-slate-400 rounded-sm"
            >
              <QuizQuestionCard
                points={question.points}
                question={question.questionText}
              />

              <ol className="p-6 text-xl">
                {question.answerType === QUESTION_TYPE.MULTIPLE_CHOICE
                  ? question.options.map((option, index) => (
                      <QuizQuestionAnswerCard
                        key={index}
                        index={index}
                        answerType={question.answerType}
                        answers={option.optionText}
                        correctAnswer={question.correctAnswer}
                      />
                    ))
                  : question.answerType === QUESTION_TYPE.LONG_ANSWER && (
                      <QuizQuestionAnswerCard
                        answerType={question.answerType}
                      />
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
