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

	console.log('CLASS ITEM: ', classItem);

	useEffect(() => {
		if (id) {
			dispatch(fetchClassById(id));
		}
	}, [dispatch, id]);

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
		<section className="pt-32 w-full h-full flex flex-col items-center overflow-hidden">
			{/* ... rest of your component */}
			<div
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
			</div>
		</section>
	);
};

export default ClassLayout;
