import { useEffect, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassById } from '../features/classGroup/classAPI';
import { Link, useParams } from 'react-router-dom';
import { QuizCard } from '../components/quizComponents';
import MemberCard from '../components/MemberCard';
import QuizCardGradientValues from '../components/quizComponents/QuizCardGradientValues';
import { PiUserSquareLight } from 'react-icons/pi';
import { CiViewList } from 'react-icons/ci';
import { IoIosAddCircleOutline } from 'react-icons/io';

const MemoizedQuizCard = memo(QuizCard);
const MemoizedMemberCard = memo(MemberCard);

const ClassLayout = () => {
	const { determineGradientClass } = QuizCardGradientValues({});

	const { id } = useParams();
	const dispatch = useDispatch();
	const classId = useSelector((state) => state.class.currentClass);
	const classItem = useSelector(
		(state) => state.class.classesById[classId] ?? null
	);
	const { error } = useSelector((state) => state.class);
	const isLoading = useSelector((state) => state.class.loading);

	// State to track the current active view
	const [activeView, setActiveView] = useState('quizzes');

	useEffect(() => {
		dispatch(fetchClassById(id));
	}, [id, dispatch]);

	// Handlers to change the active view
	const showQuizzes = () => setActiveView('quizzes');
	const showMembers = () => setActiveView('members');

	if (isLoading) {
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-forth">
				<p>Loading...</p>
			</div>
		);
	}

	if (error)
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-red-700">
				<p>Error: {error}</p>
			</div>
		);

	if (!classItem) {
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-forth">
				<p>No class data available.</p>
			</div>
		);
	}

	return (
		<section className="pt-20 lg:pt-32 w-full h-full flex flex-col items-center overflow-hidden">
			<article className="w-full bg-primary text-center border-t-4 border-t-forth border-b-4 border-b-forth mb-6">
				<div className="flex justify-start m-3 font-roboto">
					<p className="mr-1 italic">join code:</p>
					<p className="font-bold underline underline-offset-1">
						{classItem.accessCode}
					</p>
				</div>
				<h2 className="p-3 text-3xl font-bold text-forth">
					{classItem.className}
				</h2>
			</article>

			<article className="flex justify-start w-full ml:2 lg:ml-6 px-4 pt-2 lg:pt-5 pb-4 lg:pb-8 text-5xl">
				<div className="relative mx-2 hover:cursor-pointer group">
					<CiViewList
						onClick={showQuizzes}
						className={
							activeView === 'quizzes'
								? 'font-bold text-forth border-b-4 border-green-500'
								: 'font-bold text-third group-hover:text-forth'
						}
					/>
					<div className="absolute w-24 py-2 px-4 bg-slate-500 -top-9 -right-6 opacity-0 rounded-md font-bold group-hover:opacity-100 text-sm text-white font-roboto pointer-events-none">
						<p>Quiz List</p>
					</div>
				</div>

				<div className="relative mx-2 hover:cursor-pointer group">
					<PiUserSquareLight
						onClick={showMembers}
						className={
							activeView === 'members'
								? 'font-bold text-forth border-b-4 border-green-500'
								: 'font-bold text-third group-hover:text-forth'
						}
					/>
					<div className="absolute w-fit py-2 px-4 bg-slate-500 -top-9 -left-6 opacity-0 rounded-md font-bold group-hover:opacity-100 text-sm text-white font-roboto pointer-events-none">
						<p>Members</p>
					</div>
				</div>

				<div className="relative mx-2 hover:cursor-pointer group">
					<Link to="/dashboard/add-quiz">
						<IoIosAddCircleOutline className="mx-1 font-bold text-third group-hover:text-forth" />

						<div className="absolute text-center w-24 py-2 px-3 bg-slate-500 -top-9 -right-5 opacity-0 rounded-md font-bold group-hover:opacity-100 text-sm text-white font-roboto pointer-events-none">
							<p>Add Quiz</p>
						</div>
					</Link>
				</div>
			</article>

			{activeView === 'quizzes' && (
				<article
					className={
						classItem.quizzes && classItem.quizzes.length === 1
							? 'w-full h-fit lg:w-10/12 mx-2 px-2 grid grid-cols-1'
							: 'lg:w-11/12 w-full h-fit mx-2 2xl:mx-0 px-2 grid grid-cols-1 2xl:grid-cols-2 gap-4'
					}
				>
					{classItem.quizzes &&
						classItem.quizzes.map((quiz) => (
							<MemoizedQuizCard
								key={quiz._id}
								{...quiz}
								gradientClass={determineGradientClass(
									quiz.backgroundColor
								)}
							/>
						))}
				</article>
			)}

			{activeView === 'members' && (
				<section className="w-full px-4 flex flex-col items-center">
					{classItem.membership &&
						classItem.membership.map((member) =>
							member.user ? (
								<MemoizedMemberCard
									key={member._id}
									_id={member._id}
									firstName={member.user.firstName}
									lastName={member.user.lastName}
									userStatus={member.user.userStatus}
									email={member.user.email}
									memberId={member.user._id}
								/>
							) : null
						)}
				</section>
			)}
		</section>
	);
};

export default ClassLayout;
