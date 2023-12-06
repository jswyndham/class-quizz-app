import { FaSchool, FaCalendarAlt } from "react-icons/fa";
import { PiDotsThreeBold } from "react-icons/pi";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClassInfo, ConfirmDeleteModal } from "./";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useNavigate } from "react-router-dom";
import CardModal from "./CardModal";
import { toast } from "react-toastify";
import { deleteQuiz, fetchQuizzes } from "../features/quiz/quizAPI";

dayjs.extend(advancedFormat);

const QuizCard = ({ _id, quizTitle, lastUpdated, category }) => {
  //const date = day(createdAt).format('YYYY-MM-DD');

  const quizData = useSelector((state) => state.quiz.quiz);

  // STATE
  const [isCardMenu, setIsCardMenu] = useState(false);

  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    classId: null,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef();

  // USEEFFECT
  useEffect(() => {
    console.log("Rendering with quizData:", quizData);
    dispatch(fetchQuizzes());
  }, [dispatch]);

  useEffect(() => {
    const checkOutsideMenu = (e) => {
      if (
        !isCardMenu &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsCardMenu(false);
      }
    };

    document.addEventListener("click", checkOutsideMenu);
    return () => {
      document.removeEventListener("click", checkOutsideMenu);
    };
  }, []);

  // HANDLERS
  const openConfirmModal = useCallback((classId) => {
    setConfirmModalState({ isOpen: true, classId });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModalState({ isOpen: false, classId: null });
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setIsCardMenu(!isCardMenu);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/dashboard/edit-class/${_id}`);
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    try {
      await dispatch(deleteQuiz(_id));
      closeConfirmModal();
      dispatch(fetchQuizzes());
      toast.success("Quiz deleted");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  };

  const handleLink = () => {
    navigate(`/dashboard/quiz/${_id}`);
  };

  return (
    <>
      {/* Quiz CARD */}

      <article
        onClick={() => handleLink(_id)}
        className="relative w-full h-60 my-4 shadow-lg shadow-gray-400 hover:cursor-pointer"
      >
        <header className="relative flex flex-row justify-between h-fit bg-third px-12 py-5">
          <div className="">
            <h3 className="mb-2 text-2xl lg:text-3xl text-white font-bold">
              {quizTitle}
            </h3>
            <p className="text-lg lg:text-xl italic font-sans ml-4">
              {lastUpdated}
            </p>
          </div>
        </header>
        <div className="absolute w-14 h-8 right-8 top-5 bg-black bg-opacity-20 rounded-md">
          <button
            ref={menuRef}
            className="absolute z-10 text-white -mt-2 ml-1 text-5xl font-bold hover:cursor-pointer"
            onClick={handleMenuClick}
          >
            <PiDotsThreeBold />
          </button>
        </div>
        <div className="flex flex-col p-6">
          <ClassInfo icon={<FaSchool />} text={category} />
          <ClassInfo icon={<FaCalendarAlt />} text={lastUpdated} />
        </div>
        {/* CARD MENU */}
        <div onClick={handleMenuClick} className="absolute right-8 top-4">
          <CardModal
            isShowClassMenu={isCardMenu}
            handleEdit={handleEditClick}
            handleDelete={openConfirmModal}
            id={quizData._id}
          />
        </div>
      </article>

      {/* DROP MENU MODAL */}

      {confirmModalState.isOpen && (
        <ConfirmDeleteModal
          isOpen={confirmModalState.isOpen}
          onConfirm={handleDeleteClick}
          onCancel={closeConfirmModal}
          message="Are you sure you want to delete this class?"
        />
      )}
    </>
  );
};

export default QuizCard;
