import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizById } from "../features/quiz/quizAPI";
import { useParams } from "react-router-dom";
import { PiDotsThreeBold } from "react-icons/pi";

const QuizLayout = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentQuiz = useSelector((state) => state.quiz.currentQuiz);
  const { loading, error } = useSelector((state) => state.class);
  const menuRef = useRef();

  useEffect(() => {
    dispatch(fetchQuizById(id));
  }, [dispatch]);

  if (loading) return <div>Loading class...</div>;
  if (error) return <div>Error: {error}</div>;

  // console.log("CURRENT QUIZ STATUS: ", currentQuiz);

  console.log("Quiz ID from URL: ", id);
  // console.log("QUIZ QUESTIONS: ", currentQuiz.questions);

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
        <div className="w-3/4 h-fit p-6 border-0 border-slate-700 ">
          {currentQuiz.questions.map((questions) => {
            return <div key={questions.id}>{questions.questionText}</div>;
          })}
        </div>
      </article>
    </section>
  );
};

export default QuizLayout;
