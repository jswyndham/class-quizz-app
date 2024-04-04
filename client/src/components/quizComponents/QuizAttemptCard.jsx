/**
 * QuizAttemptCard Component
 * Displays a card representing a quiz for class members to take.
 * It includes interactive elements like a menu for editing and deleting, and a modal for delete confirmation.
 */

import { MdFormatListNumbered } from 'react-icons/md';
import { FaCalendarAlt } from 'react-icons/fa';
import { GrScorecard } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { RxUpdate } from 'react-icons/rx';
import dayjs from 'dayjs'; // Date formatting
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useNavigate, useParams } from 'react-router-dom';
import { selectQuizAttemptDataArray } from '../../features/quizAttempt/quizAttemptSelector';
import { useCallback, useEffect, useState } from 'react';
import { QuizPopUpModal } from '../QuizPopUpModal';
import { GoDotFill } from 'react-icons/go';
import { fetchQuizById } from '../../features/quiz/quizAPI';

dayjs.extend(advancedFormat);

const QuizAttemptCard = ({
	quizAttemptId,
	quizId,
	quizTitle,
	quizDescription,
	questionCount,
	startDate,
	endDate,
	totalPoints,
	gradientClass,
	isVisibleToStudent,
}) => {
	const quiz = useSelector((state) => state.quiz.currentQuiz);
	const quizAttemptData = useSelector(selectQuizAttemptDataArray);
	const isLoading = useSelector((state) => state.quizAttempt.loading);

	const startDateFormatted = dayjs(startDate).format('YYYY-MM-DD HH:mma');
	const endDateFormatted = dayjs(endDate).format('YYYY-MM-DD HH:mma');

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const isQuizActive = useCallback(() => {
		const now = dayjs();
		return (
			quiz &&
			dayjs(quiz.startDate).isBefore(now) &&
			dayjs(quiz.endDate).isAfter(now)
		);
	}, [quiz]);

	const [isActive, setIsActive] = useState(isQuizActive());

	useEffect(() => {
		if (quizId) {
			dispatch(fetchQuizById(quizId));
		}
	}, [quizId, dispatch]);

	useEffect(() => {
		setIsActive(isQuizActive());
	}, [isQuizActive]);

	// Manage the popup confirmation modal
	const [confirmModalState, setConfirmModalState] = useState({
		isOpen: false,
		classId: null,
	});

	console.log('Quiz: ', quiz);
	console.log('Quiz ID: ', quizId);

	// *************** EVENT HANDLERS ****************

	// Opens the delete confirmation modal
	const openConfirmModal = useCallback((classId) => {
		setConfirmModalState({ isOpen: true, classId });
	}, []);

	// Closes the delete confirmation modal
	const closeConfirmModal = useCallback(() => {
		setConfirmModalState({ isOpen: false, classId: null });
	}, []);

	// Navigates to the quiz detail page
	const handleLink = () => {
		if (isActive) {
			navigate(`/dashboard/quizAttempt/${quizAttemptId}`);
		} else {
			openConfirmModal();
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-forth">
				<p>Loading...</p>
			</div>
		);
	}

	// For debugging purposes
	console.log('QuizAttemptCard isVisibleToStudent:', isVisibleToStudent);
	console.log('QuizAttemptCard isActive:', isActive);

	return (
		<>
			{/* ************** Quiz Attempt Card ***************** */}

			{isVisibleToStudent ? (
				<>
					<article
						onClick={handleLink}
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

						{/* ************ Quiz Description ************ */}

						<div className="pb-2 pt-4 px-4 border-2 border-slate-400 bg-slate-200">
							<div className="w-fit h-fit px-3 bg-gradient-to-r from-secondary via-third to-forth rounded-full drop-shadow-sm shadow-md shadow-slate-500">
								<h3 className="text-slate-50 text-lg text-robotoCondensed font-bold">
									Quiz Description
								</h3>
							</div>
							<div
								className={`flex flex-col md:flex-row px-5 py-3 xl:py-3 xl:px-10`}
								dangerouslySetInnerHTML={{
									__html: quizDescription,
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
								<div className="flex flex-col md:flex-row px-10 py-2 xl:px-16 bg-white border-2 border-red-600">
									<div className="flex flex-row">
										<p className="font-robotoCondensed text-xl text-red-700">
											This quiz is not currently active
										</p>
										<GoDotFill className="text-red-500 text-3xl ml-8" />
									</div>
								</div>
							</>
						)}

						{/* *********** Quiz info details ************ */}

						<div
							className={`flex flex-col md:flex-row px-10 py-2 xl:py-3 xl:px-16 bg-white rounded-b-md border-2 border-slate-400`}
						>
							<div className="flex flex-col">
								<div className="flex flex-row my-1 text-sm md:text-md">
									<MdFormatListNumbered className="mt-1 mr-2" />
									<p className="">
										{questionCount} questions
									</p>
								</div>
								<div className="flex flex-row my-1 text-sm md:text-md">
									<RxUpdate className="mt-1 mr-2" />
									<p>Open From: {startDateFormatted}</p>
								</div>
							</div>
							<div className="flex flex-col-reverse md:flex-col md:ml-6 lg:ml-20">
								<div className="flex flex-row my-1 text-sm md:text-md">
									<GrScorecard className="mt-1 mr-2" />
									<p>{totalPoints} points total</p>
								</div>
								<div className="flex flex-row my-1 text-sm md:text-md">
									<FaCalendarAlt className="mt-1 mr-2" />
									<p>Open Until: {endDateFormatted}</p>
								</div>
							</div>
						</div>
					</article>

					{/* *********** isActive modal pop-up *************** */}

					{confirmModalState.isOpen && (
						<QuizPopUpModal
							isOpen={confirmModalState.isOpen}
							onConfirm={closeConfirmModal}
							message="This quiz is currently not active. Please check 'Open from' & 'Open until' dates to see when this quiz is active."
						/>
					)}
				</>
			) : (
				<article>
					<div>
						<h2>No quiz to see here</h2>
					</div>
				</article>
			)}
		</>
	);
};

export default QuizAttemptCard;
