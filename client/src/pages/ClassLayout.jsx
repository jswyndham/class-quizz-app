import { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassById } from '../features/classGroup/classAPI';
import { useParams } from 'react-router-dom';
import { QuizCard } from '../components/quizComponents';
import QuizCardGradientValues from '../components/quizComponents/QuizCardGradientValues';

const MemoizedQuizCard = memo(QuizCard);

const ClassLayout = () => {
	const { determineGradientClass } = QuizCardGradientValues({});

	const { id } = useParams();
	const dispatch = useDispatch();
	const classItem = useSelector((state) => state.class.currentClass);
	const { error } = useSelector((state) => state.class);

	useEffect(() => {
		dispatch(fetchClassById(id));
	}, [id, dispatch]);

	if (error) return <div>Error: {error}</div>;

	if (!classItem) {
		return (
			<div className="h-screen w-full flex justify-center">
				<h2 className="text-3xl font-display font-bold italic mt-44">
					No class data available.
				</h2>
			</div>
		);
	}

	return (
		<section className="pt-32 w-full h-screen flex flex-col justify-center overflow-hidden">
			<div className="w-full bg-primary text-center border-t-4 border-t-forth border-b-4 border-b-forth mb-6">
				<h2 className="my-2 text-3xl font-bold text-forth">
					{classItem.className}
				</h2>
			</div>
			<div
				className={
					classItem.quizzes.length === 1
						? 'lg:w-10/12 w-full h-full md:mx-2 grid grid-cols-1'
						: 'lg:w-10/12 w-full h-full md:mx-2 grid grid-cols-1 2xl:grid-cols-2 gap-4'
				}
			>
				{classItem.quizzes.map((quiz) => (
					<MemoizedQuizCard
						key={quiz._id}
						{...quiz}
						gradientClass={determineGradientClass(
							quiz.backgroundColor
						)}
					/>
				))}
			</div>
		</section>
	);
};

export default ClassLayout;
