/**
 * QuizCard Component
 * Displays a card representing a quiz with options to copy, edit, delete, and view details.
 * It includes interactive elements like a menu for editing and deleting, and a modal for delete confirmation.
 */

import { MdFormatListNumbered } from 'react-icons/md';
import { FaCalendarAlt } from 'react-icons/fa';
import { GrScorecard } from 'react-icons/gr';
import { PiDotsThreeBold } from 'react-icons/pi';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RxUpdate } from 'react-icons/rx';
import { ConfirmDeleteModal } from '../';
import dayjs from 'dayjs'; // Date formatting
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useNavigate, useParams } from 'react-router-dom';
import CardMenu from '../CardMenu';
import { toast } from 'react-toastify';
import {
	deleteQuiz,
	fetchQuizzes,
	copyQuizToClass,
	fetchQuizById,
} from '../../features/quiz/quizAPI';
import CopyItem from '../CopyItem';
import { fetchClasses } from '../../features/classGroup/classAPI';
import { selectQuizDataArray } from '../../features/quiz/quizSelectors';

dayjs.extend(advancedFormat);

const QuizCard = ({
	_id,
	quizTitle,
	questionCount,
	totalPoints,
	createdAt,
	updatedAt,
	gradientClass,
}) => {
	const quizData = useSelector(selectQuizDataArray);

	const createdData = dayjs(createdAt).format('MMMM D, YYYY');
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

	// Cllick outside the card menu to close
	useEffect(() => {
		const checkOutsideMenu = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.currentTarget)) {
				setIsCardMenu(false);
			}
		};

		document.addEventListener('click', checkOutsideMenu);
		return () => {
			document.removeEventListener('click', checkOutsideMenu);
		};
	}, [isCardMenu]);

	// Click outside the 'copy-class list' to close
	useEffect(() => {
		const checkOutsideMenu = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.currentTarget)) {
				setIsClassList(false);
			}
		};

		document.addEventListener('click', checkOutsideMenu);
		return () => {
			document.removeEventListener('click', checkOutsideMenu);
		};
	}, [isClassList]);

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
			const actionResult = await dispatch(
				copyQuizToClass({ _id, classId })
			);
			if (copyQuizToClass.fulfilled.match(actionResult)) {
				const newQuizId = actionResult.payload.newQuizId;

				// Fetch the complete details of the newly copied quiz
				await dispatch(fetchQuizById(newQuizId));

				// Optionally, you might want to fetch all quizzes or classes again
				// if the UI needs to be updated with the latest state
				dispatch(fetchQuizzes());
				dispatch(fetchClasses());

				toast.success('Quiz copied to class successfully');
			}
		} catch (error) {
			toast.error('Failed to copy quiz to class');
			console.error('Error copying quiz to class:', error);
		} finally {
			handleClassListClose(e);
			handleMenuClick(e);
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
			await dispatch(deleteQuiz(_id)).unwrap();
			closeConfirmModal();
			await dispatch(fetchClasses());
			toast.success('Quiz deleted');
		} catch (error) {
			toast.error(error?.response?.data?.msg || 'Failed to delete quiz');
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
				className="relative w-full h-fit my-2 shadow-lg shadow-gray-400 rounded-b-md hover:cursor-pointer"
			>
				<header
					className={`relative flex flex-row justify-between h-fit px-2 py-1 border-2 border-slate-400 rounded-t-md ${gradientClass}`}
				>
					<div className="w-full h-full bg-slate-100 rounded-md bg-opacity-70">
						<h3 className="mx-3 my-1 text-xl lg:text-2xl text-forth font-bold">
							{quizTitle}
						</h3>
					</div>
				</header>
				<div className="absolute w-14 h-7 mt-0.5 lg:h-8 right-4 top-2 bg-black bg-opacity-30 rounded-md hover:bg-opacity-40">
					<button
						ref={menuRef}
						className="absolute text-white -top-1 lg:-top-2 right-2 lg:right-1 mr-0.5 lg:mr-0 text-4xl lg:text-5xl font-bold hover:cursor-pointer"
						onClick={handleMenuClick}
					>
						<PiDotsThreeBold />
					</button>
				</div>

				{/* Quiz info details */}
				<div
					className={`flex flex-col md:flex-row px-10 py-2 xl:py-3 xl:px-16 bg-white rounded-b-md border-2 border-slate-400`}
				>
					<div className="flex flex-col">
						<div className="flex flex-row my-1 text-sm md:text-md">
							<MdFormatListNumbered className="mt-1 mr-2" />
							<p className="">{questionCount} questions</p>
						</div>
						<div className="flex flex-row my-1 text-sm md:text-md">
							<RxUpdate className="mt-1 mr-2" />
							<p>updated: {updatedData}</p>
						</div>
					</div>
					<div className="flex flex-col-reverse md:flex-col md:ml-6 lg:ml-20">
						<div className="flex flex-row my-1 text-sm md:text-md">
							<GrScorecard className="mt-1 mr-2" />
							<p>{totalPoints} points</p>
						</div>
						<div className="flex flex-row my-1 text-sm md:text-md">
							<FaCalendarAlt className="mt-1 mr-2" />
							<p>created: {createdData}</p>
						</div>
					</div>
				</div>

				{/* Quiz card menu */}
				<div
					onClick={handleMenuClick}
					className="absolute right-2 top-2"
				>
					<CardMenu
						isShowClassMenu={isCardMenu}
						listNameOne="Copy"
						handleCopy={handleClassListOpen}
						listNameTwo="Edit"
						handleEdit={handleEditClick}
						listNameThree="Delete"
						handleDelete={openConfirmModal}
						id={quizData._id}
						menuConfig={{
							copy: true, // show the first option
							edit: true, // show the second option
							delete: true, // show the third option
						}}
					/>
				</div>

				{/* Class List for menu "copy" */}
				<div className="absolute w-full top-2 right-2">
					<CopyItem
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
					message="Are you sure you want to delete this quiz?"
				/>
			)}
		</>
	);
};

export default QuizCard;
