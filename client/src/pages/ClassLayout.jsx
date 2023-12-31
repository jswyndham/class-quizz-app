import { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassById } from '../features/classGroup/classAPI';
import { useParams } from 'react-router-dom';
import { QuizCard } from '../components';

const MemoizedQuizCard = memo(QuizCard);

const ClassLayout = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const classItem = useSelector((state) => state.class.currentClass);
	const { error } = useSelector((state) => state.class);

	useEffect(() => {
		dispatch(fetchClassById(id));
	}, [id, dispatch]);

	// useEffect(() => {
	// 	console.log('Current Class Updated:', classItem);
	// }, [classItem]);

	// if (loading) return <div>Loading class...</div>;

	if (error) return <div>Error: {error}</div>;

	if (!classItem) {
		return (
			<div className="h-screen w-screen flex justify-center">
				<h2 className="text-3xl font-display font-bold italic mt-44">
					No class data available.
				</h2>
			</div>
		);
	}

	return (
		<section className="flex flex-col items-center w-screen h-screen overflow-hidden">
			<div className="w-full bg-primary text-center mt-32 border-t-4 border-t-forth border-b-4 border-b-forth">
				<h2 className="my-2 text-3xl font-bold text-forth">
					{classItem.className}
				</h2>
			</div>
			<div className="2xl:w-8/12 md:w-10/12 xl:9/12 w-full h-fit px-2 mt-8 md:mx-6 grid grid-cols-1 xl:grid-cols-2 2xl:grid-rows-2 gap-4">
				{classItem.quizzes.map((quiz) => (
					<MemoizedQuizCard key={quiz._id} {...quiz} />
				))}
			</div>
		</section>
	);
};

export default ClassLayout;
