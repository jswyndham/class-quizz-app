/**
 * QuizCard Component
 * Displays a card representing a quiz with options to copy, edit, delete, and view details.
 * It includes interactive elements like a menu for editing and deleting, and a modal for delete confirmation.
 */

// *********** React *******************
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// ************* Toastify modal ***************
import { toast } from 'react-toastify';

// ************ Date & Time ***********
import dayjs from 'dayjs'; // Date formatting
import advancedFormat from 'dayjs/plugin/advancedFormat';

// *********** React Components **********
import { ConfirmDeleteModal } from '../';
import CardMenu from '../CardMenu';
import CopyItem from '../CopyItem';

//  ************** Redux *****************
import { useDispatch, useSelector } from 'react-redux';
import {
	deleteQuiz,
	fetchQuizzes,
	copyQuizToClass,
	fetchQuizById,
} from '../../features/quiz/quizAPI';
import { fetchClasses } from '../../features/classGroup/classAPI';
import { selectQuizDataArray } from '../../features/quiz/quizSelectors';

// ************* React Icons ********************
import { MdFormatListNumbered } from 'react-icons/md';
import { FaCalendarAlt } from 'react-icons/fa';
import { GrScorecard } from 'react-icons/gr';
import { PiDotsThreeBold } from 'react-icons/pi';
import { GoDotFill } from 'react-icons/go';
import { FaLockOpen } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { RxUpdate } from 'react-icons/rx';

dayjs.extend(advancedFormat);

const QuizCard = ({
	_id,
	quizTitle,
	quizDescription,
	questionCount,
	totalPoints,
	createdAt,
	updatedAt,
	gradientClass,
	startDate,
	endDate,
}) => {
	const quizData = useSelector(selectQuizDataArray);

	// *********** Date formats *************
	const createdData = dayjs(createdAt).format('MMMM D, YYYY');
	const updatedData = dayjs(updatedAt).format('MMMM D, YYYY');

	const startDateFormatted = dayjs(startDate).format('YYYY-MM-DD HH:mma');
	const endDateFormatted = dayjs(endDate).format('YYYY-MM-DD HH:mma');

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

	const isQuizActive = useCallback(() => {
		const now = dayjs();
		return (
			quizData &&
			dayjs(startDate).isBefore(now) &&
			dayjs(endDate).isAfter(now)
		);
	}, [quizData]);

	const [isActive, setIsActive] = useState(isQuizActive());

	useEffect(() => {
		if (_id) {
			dispatch(fetchQuizById(_id));
		}
	}, [_id, dispatch]);

	useEffect(() => {
		setIsActive(isQuizActive());
	}, [isQuizActive]);

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

	function truncateString(str, maxLength) {
		if (str.length > maxLength) {
			return str.substring(0, maxLength - 3) + '...';
		}
		return str;
	}

	// Class name with trunate function
	const quizDescriptionOriginal = `${quizDescription}`;
	const quizDescriptionTrunicate = truncateString(
		quizDescriptionOriginal,
		250
	);

	return (
		<>
			{/* ************ Quiz card ************ */}

			<article
				onClick={() => handleLink(_id)}
				className="relative w-full h-fit my-2 shadow-lg shadow-gray-400 rounded-b-md hover:cursor-pointer"
			>
				<header
					className={`relative flex flex-row justify-between h-fit p-1 border-2 border-slate-400 rounded-t-md ${gradientClass}`}
				>
					<div className="w-full h-full bg-slate-100 rounded-md bg-opacity-60">
						<h3 className="mx-3 my-1 text-xl lg:text-2xl text-forth font-bold">
							{quizTitle}
						</h3>
					</div>
				</header>

				{/* ************* Quiz Menu Button ************** */}

				<div className="absolute w-14 h-7 mt-0.5 lg:h-8 right-4 top-2 bg-black bg-opacity-30 rounded-md hover:bg-opacity-40">
					<button
						ref={menuRef}
						className="absolute text-white -top-1 lg:-top-2 right-2 lg:right-1 mr-0.5 lg:mr-0 text-4xl lg:text-5xl font-bold hover:cursor-pointer"
						onClick={handleMenuClick}
					>
						<PiDotsThreeBold />
					</button>
				</div>

				{/* ************ Quiz Description ************ */}

				<div className="h-52 pb-2 pt-4 px-4 border-2 border-slate-400 bg-slate-200">
					<div className="w-fit h-fit px-3 bg-gradient-to-r from-secondary via-third to-forth rounded-full drop-shadow-sm shadow-md shadow-slate-500">
						<h3 className="text-slate-50 text-lg text-robotoCondensed font-bold">
							Quiz Description
						</h3>
					</div>
					<div
						className={`flex flex-col md:flex-row px-5 py-3 xl:py-3 xl:px-10`}
						dangerouslySetInnerHTML={{
							__html: quizDescriptionTrunicate,
						}}
					/>
				</div>

				{/* *********** Quiz is Active ************ */}

				{isActive ? (
					<>
						<div className="flex flex-col md:flex-row px-10 py-1 xl:px-16 bg-white border-2 border-green-600">
							<div className="flex flex-row">
								<p className="font-robotoCondensed text-xl text-green-700">
									This quiz is currently active
								</p>
								<GoDotFill className="text-green-500 text-3xl ml-8" />
							</div>
						</div>
					</>
				) : (
					<>
						<div className="flex flex-col md:flex-row px-10 py-1 xl:px-16 bg-white border-2 border-red-600">
							<div className="flex flex-row">
								<p className="font-robotoCondensed text-xl text-red-700">
									This quiz is not currently active
								</p>
								<GoDotFill className="text-red-500 text-3xl ml-8" />
							</div>
						</div>
					</>
				)}

				{/*  *********** Quiz Active Dates ****************** */}

				<div className="w-full flex flex-col md:flex-row md:justify-start pl-6 md:pl-12 border-2 border-slate-400 bg-slate-500 text-white">
					<div className="flex flex-row my-1 md:mr-5">
						<FaLockOpen className="mt-1 mr-2" />
						<p className="text-yellow-200">Start Date:</p>
						<p className="mx-2">{startDateFormatted}</p>
					</div>
					<div className="flex flex-row my-1 md:ml-5">
						<FaLock className="mt-1 mr-2" />
						<p className="text-yellow-200">Finish Date:</p>
						<p className="mx-2">{endDateFormatted}</p>
					</div>
				</div>

				{/* *********** Quiz info details ************ */}

				<div className="flex flex-col justify-start px-8 py-4 xl:py-3 xl:px-0 bg-white rounded-b-md border-2 border-slate-400 text-sm md:text-md">
					<div className="flex flex-col md:flex-row md:justify-start ml-6 md:ml-10">
						<div className="flex flex-row my-1 md:mr-5">
							<MdFormatListNumbered className="mt-1 mr-2" />
							<p className="">{questionCount} questions</p>
						</div>
						<div className="flex flex-row my-1 md:ml-24">
							<GrScorecard className="mt-1 mr-2" />
							<p>{totalPoints} points</p>
						</div>
					</div>
					<div className="flex flex-col md:flex-row md:justify-start ml-6 md:ml-10">
						<div className="flex flex-row my-1 md:mr-5">
							<RxUpdate className="mt-1 mr-2" />
							<p>updated: {updatedData}</p>
						</div>
						<div className="flex flex-row my-1 md:ml-5">
							<FaCalendarAlt className="mt-1 mr-2" />
							<p>created: {createdData}</p>
						</div>
					</div>
				</div>

				{/* *********** Quiz card menu ************ */}
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
