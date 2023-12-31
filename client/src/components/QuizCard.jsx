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
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useNavigate } from 'react-router-dom';
import CardMenu from './CardMenu';
import { toast } from 'react-toastify';
import { deleteQuiz, fetchQuizzes } from '../features/quiz/quizAPI';

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

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const menuRef = useRef();

	// Fetches quiz data on component mount
	useEffect(() => {
		console.log('Rendering with quizData:', quizData);
		dispatch(fetchQuizzes());
	}, []);

	// Closes the delete confirmation modal
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

		document.addEventListener('click', checkOutsideMenu);
		return () => {
			document.removeEventListener('click', checkOutsideMenu);
		};
	}, [isCardMenu]);

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
			{/* Quiz CARD */}

			<article
				onClick={() => handleLink(_id)}
				className="relative w-full h-44 my-4 shadow-lg shadow-gray-400 hover:cursor-pointer"
			>
				<header className="relative flex flex-row justify-between h-fit bg-third px-12 py-4">
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
						className="absolute text-white -mt-2 ml-1 text-5xl font-bold hover:cursor-pointer"
						onClick={handleMenuClick}
					>
						<PiDotsThreeBold />
					</button>
				</div>
				<div className="flex flex-col m-4 pb-2">
					<ClassInfo icon={<FaSchool />} text={category} />
					<ClassInfo icon={<FaCalendarAlt />} text={updatedData} />
				</div>
				{/* CARD MENU */}
				<div
					onClick={handleMenuClick}
					className="absolute right-8 top-4"
				>
					<CardMenu
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
