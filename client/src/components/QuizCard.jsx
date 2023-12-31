/**
 * QuizCard Component
 * Displays a card representing a quiz with options to edit, delete, and view details.
 * It includes interactive elements like a menu for editing and deleting, and a modal for delete confirmation.
 */

import { FaSchool, FaCalendarAlt } from 'react-icons/fa';
import { PiDotsThreeBold } from 'react-icons/pi';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClassInfo, ConfirmDeleteModal } from './';
import dayjs from 'dayjs'; // Date formatting
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useNavigate } from 'react-router-dom';
import CardMenu from './CardMenu';
import { toast } from 'react-toastify';
import {
	deleteQuiz,
	fetchQuizzes,
	copyQuizToClass,
} from '../features/quiz/quizAPI';
import CardMenuCopy from './CardMenuCopy';

dayjs.extend(advancedFormat);

const QuizCard = ({ _id, quizTitle, lastUpdated, category, updatedAt }) => {
	const quizData = useSelector((state) => state.quiz.quiz);

	const updatedData = dayjs(updatedAt).format('MMMM D, YYYY');

	// STATE HOOKS
	// Manage the visibility of the card menu
	const [isCardMenu, setIsCardMenu] = useState(false);

	// Manage the delete confirmation modal
	const [confirmModalState, setConfirmModalState] = useState({
		isOpen: false,
		classId: null,
	});

	const [isClassList, setIsClassList] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const menuRef = useRef();

	// Fetches quiz data on component mount
	useEffect(() => {
		dispatch(fetchQuizzes());
	}, [dispatch]);

	// Closes the delete confirmation modal
	useEffect(() => {
		const checkOutsideMenu = (e) => {
			if (
				!isCardMenu &&
				menuRef.current &&
				!menuRef.current.contains(e.currentTarget)
			) {
				setIsCardMenu(false);
			}
		};

		document.addEventListener('click', checkOutsideMenu);
		return () => {
			document.removeEventListener('click', checkOutsideMenu);
		};
	}, []);

	// EVENT HANDLERS
	// Opens the delete confirmation modal
	const openConfirmModal = useCallback((classId) => {
		setConfirmModalState({ isOpen: true, classId });
	}, []);

	// Closes the delete confirmation modal
	const closeConfirmModal = useCallback(() => {
		setConfirmModalState({ isOpen: false, classId: null });
	}, []);

	// Toggles the card menu visibility
	const handleMenuClick = (e) => {
		e.stopPropagation();
		setIsCardMenu(!isCardMenu);
	};

	// Open the class list in card menu (used to "copy" & "move" the selected quiz)
	const handleClassListOpen = (e) => {
		e.stopPropagation();
		setIsClassList(!isClassList);
	};

	// Close the class list in card menu (used to "copy" & "move" the selected quiz)
	const handleClassListClose = (e) => {
		e.stopPropagation();
		setIsClassList(!isClassList);
	};

	// Handle copying selected quiz to new class
	const handleCopyQuizToClass = async (e, classId) => {
		e.stopPropagation();
		try {
			await dispatch(copyQuizToClass({ _id: _id, classId }));

			toast.success('Quiz copied to class successfully');
		} catch (error) {
			toast.error('Failed to copy quiz to class');
			console.error('Error copying quiz to class:', error);
		}
	};

	// Navigates to the edit quiz page
	const handleEditClick = (e) => {
		e.stopPropagation();
		try {
			navigate(`/dashboard/edit-quiz/${_id}`);
		} catch (error) {
			toast.error(error?.response?.data?.msg);
			console.error('ERROR: ', msg.error);
		}
	};

	// Handles the deletion of the quiz
	const handleDeleteClick = async (e) => {
		e.stopPropagation();
		try {
			await dispatch(deleteQuiz(_id));
			closeConfirmModal();
			dispatch(fetchQuizzes());
			toast.success('Quiz deleted');
		} catch (error) {
			toast.error(error?.response?.data?.msg);
		}
	};

	// Navigates to the quiz detail page
	const handleLink = () => {
		navigate(`/dashboard/quiz/${_id}`);
	};

	return (
		<>
			{/* Quiz card */}

			<article
				onClick={() => handleLink(_id)}
				className="relative w-full h-44 my-4 shadow-lg shadow-gray-400 hover:cursor-pointer"
			>
				<header className="relative flex flex-row justify-between h-fit bg-third px-6 lg:px-8 py-4">
					<div className="">
						<h3 className="mb-2 text-xl lg:text-3xl text-white font-bold">
							{quizTitle}
						</h3>
						<p className="text-lg lg:text-xl italic font-sans ml-4">
							{lastUpdated}
						</p>
					</div>
				</header>
				<div className="absolute w-14 h-7 lg:h-8 right-2 lg:right-4 top-5 bg-black bg-opacity-20 rounded-md">
					<button
						ref={menuRef}
						className="absolute text-white -top-1 lg:-top-2 right-2 lg:right-1 mr-0.5 lg:mr-0 text-4xl lg:text-5xl font-bold hover:cursor-pointer"
						onClick={handleMenuClick}
					>
						<PiDotsThreeBold />
					</button>
				</div>
				<div className="flex flex-col m-4 pb-2">
					<ClassInfo icon={<FaSchool />} text={category} />
					<ClassInfo icon={<FaCalendarAlt />} text={updatedData} />
				</div>

				{/* Quiz card menu */}
				<div
					onClick={handleMenuClick}
					className="absolute right-8 top-4"
				>
					<CardMenu
						isShowClassMenu={isCardMenu}
						handleCopy={handleClassListOpen}
						handleEdit={handleEditClick}
						handleDelete={openConfirmModal}
						id={quizData._id}
					/>
				</div>

				{/* Class List for menu "copy" */}
				<div className="absolute w-full top-10 right-8">
					<CardMenuCopy
						isShowClassList={isClassList}
						classListClose={handleClassListClose}
						quizOnClick={(e, classId) =>
							handleCopyQuizToClass(e, classId)
						}
					/>
				</div>
			</article>

			{/* Delete quiz modal */}
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
