import { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassById } from '../features/classGroup/classAPI';
import { Link, useParams } from 'react-router-dom';
import { QuizCard } from '../components/quizComponents';
import QuizCardGradientValues from '../components/quizComponents/QuizCardGradientValues';
import { PiUserSquareLight } from 'react-icons/pi';
import { CiViewList } from 'react-icons/ci';
import { IoIosAddCircleOutline } from 'react-icons/io';

const MemoizedQuizCard = memo(QuizCard);

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

	useEffect(() => {
		dispatch(fetchClassById(id));
	}, [id, dispatch]);

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
		<section className="pt-32 w-full h-full flex flex-col items-center overflow-hidden">
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

			<article className="flex justify-start w-full px-4 pb-8 text-5xl">
				<div className="relative hover:cursor-pointer group">
					<CiViewList className="mx-1 font-bold text-third group-hover:text-forth" />
					<div className="absolute w-fit py-2 px-4 bg-slate-500 top-12 right-0 opacity-0 rounded-md font-bold group-hover:opacity-100 text-sm text-white font-roboto pointer-events-none">
						<p>Quiz</p>
					</div>
				</div>

				<div className="relative hover:cursor-pointer group">
					<PiUserSquareLight className="mx-2 font-bold text-third group-hover:text-forth" />
					<div className="absolute w-fit py-2 px-4 bg-slate-500 top-12 -left-4 opacity-0 rounded-md font-bold group-hover:opacity-100 text-sm text-white font-roboto pointer-events-none">
						<p>Members</p>
					</div>
				</div>

				<div className="relative hover:cursor-pointer group">
					<Link to="/dashboard/add-quiz">
						<IoIosAddCircleOutline className="mx-1 font-bold text-third group-hover:text-forth" />

						<div className="absolute text-center w-24 py-2 px-3 bg-slate-500 top-12 -right-4 opacity-0 rounded-md font-bold group-hover:opacity-100 text-sm text-white font-roboto pointer-events-none">
							<p>Add Quiz</p>
						</div>
					</Link>
				</div>
			</article>

			<article
				className={
					classItem.quizzes && classItem.quizzes.length === 1
						? 'lg:w-10/12 w-full h-fit mx-2 px-2 grid grid-cols-1'
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
		</section>
	);
};

export default ClassLayout;
