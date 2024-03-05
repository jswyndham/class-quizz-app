/**
 * QuizAttemptCard Component
 * Displays a card representing a quiz for class members to take.
 * It includes interactive elements like a menu for editing and deleting, and a modal for delete confirmation.
 */

import { MdFormatListNumbered } from 'react-icons/md';
import { FaCalendarAlt } from 'react-icons/fa';
import { GrScorecard } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import { RxUpdate } from 'react-icons/rx';
import dayjs from 'dayjs'; // Date formatting
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useNavigate, useParams } from 'react-router-dom';
import { selectQuizAttemptDataArray } from '../../features/quizAttempt/quizAttemptSelector';

dayjs.extend(advancedFormat);

const QuizAttemptCard = ({
	quizAttemptId,
	quizTitle,
	questionCount,
	totalPoints,
	createdAt,
	updatedAt,
	gradientClass,
}) => {
	const isLoading = useSelector((state) => state.quizAttempt.loading);

	const createdData = dayjs(createdAt).format('MMMM D, YYYY');
	const updatedData = dayjs(updatedAt).format('MMMM D, YYYY');

	const navigate = useNavigate();

	// EVENT HANDLERS
	// Navigates to the quiz detail page
	const handleLink = () => {
		if (typeof quizAttemptId === 'string') {
			navigate(`/dashboard/quizAttempt/${quizAttemptId}`);
		} else {
			console.error('Invalid quizAttemptId:', quizAttemptId);
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

	return (
		<>
			{/* Quiz card */}

			<article
				onClick={() => handleLink(quizAttemptId)}
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
			</article>
		</>
	);
};

export default QuizAttemptCard;
