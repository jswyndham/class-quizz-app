import { useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ClassCard from "./ClassCard";
import { fetchQuizzes } from "../features/quiz/quizAPI";
import { fetchCurrentUser } from "../features/users/userAPI";

const MemoizedQuizCard = memo(ClassCard);

const QuizContainer = () => {
  const userData = useSelector((state) => state.class.currentUser);
  const quizData = useSelector((state) => state.quiz.quiz);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData) {
      dispatch(fetchCurrentUser());
    }
  }, [userData, dispatch]);

  useEffect(() => {
    console.log("Rendering with quizData:", quizData);
    dispatch(fetchQuizzes());
  }, [dispatch]);

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

  // RETURN QUIZZES ARRAY
  return (
    <section className="flex justify-center h-screen w-screen pt-36 px-4">
      <div className="2xl:w-7/12 w-full h-fit mx-2 md:mx-12 grid grid-cols-1 2xl:grid-rows-2 gap-4">
        {quizData.map((quiz) => {
          return <MemoizedQuizCard key={quiz._id} {...quiz} />;
        })}
      </div>
    </section>
  );
};

export default QuizContainer;
