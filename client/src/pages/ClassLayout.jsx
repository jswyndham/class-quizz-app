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
		<section className="w-full h-fit flex flex-col justify-center align-middle overflow-hidden">
			<div className="w-full bg-primary text-center mt-32 border-t-4 border-t-forth border-b-4 border-b-forth">
				<h2 className="my-2 text-3xl font-bold text-forth">
					{classItem.className}
				</h2>
			</div>
			<div className="2xl:max-w-7xl w-full h-fit px-4 mt-6 grid grid-cols-1 xl:grid-cols-2 2xl:grid-rows-2 gap-4">
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
