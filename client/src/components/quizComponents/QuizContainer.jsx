import { useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import QuizCard from "./QuizCard";
import { fetchQuizzes } from "../../features/quiz/quizAPI";
import { fetchCurrentUser } from "../../features/user/userAPI";
import QuizCardGradientValues from "./QuizCardGradientValues";

const MemoizedQuizCard = memo(QuizCard);

const QuizContainer = ({ _id }) => {
  const userData = useSelector((state) => state.class.currentUser);
  const quizData = useSelector((state) => state.quiz.quiz);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData) {
      dispatch(fetchCurrentUser());
    }
  }, []);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, []);

  // Defines the color value and returns the gradient in the css
  const { determineGradientClass } = QuizCardGradientValues({});

  // NO QUIZZES TO DISPLAY
  if (quizData.length === 0) {
    return (
      <div className="h-screen w-screen flex justify-center">
        <h2 className="text-3xl font-display font-bold italic mt-44">
          You currently have no quizzes to display.
        </h2>
      </div>
    );
  }

  return (
    <section className="flex justify-center h-full w-full pt-36 md:px-4 pb-8 overflow-hidden">
      <div
        className={
          quizData.length === 1
            ? "lg:w-10/12 w-full h-fit md:mx-2 grid grid-cols-1"
            : "lg:w-10/12 w-full h-fit md:mx-2 grid grid-cols-1 2xl:grid-cols-2 gap-4"
        }
      >
        {quizData.map((quiz) => (
          <MemoizedQuizCard
            key={quiz._id}
            {...quiz}
            gradientClass={determineGradientClass(quiz.backgroundColor)}
          />
        ))}
      </div>
    </section>
  );
};

export default QuizContainer;
