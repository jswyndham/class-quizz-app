import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassById } from '../features/classGroup/classAPI';
import QuizContainer from '../components/QuizContainer';
import { useParams } from 'react-router-dom';

const ClassLayout = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const currentClass = useSelector((state) => state.class.currentClass);
	const { loading, error } = useSelector((state) => state.class);

	useEffect(() => {
		dispatch(fetchClassById(id));
	}, [dispatch, id]);

	console.log('Current Class:', currentClass);

	if (loading) return <div>Loading class...</div>;
	if (error) return <div>Error: {error}</div>;

	if (!currentClass) {
		return (
			<div className="h-screen w-screen flex justify-center">
				<h2 className="text-3xl font-display font-bold italic mt-44">
					No class data available.
				</h2>
			</div>
		);
	}

	return (
		<section className="w-screen h-screen flex flex-col justify-center align-middle">
			<div className="mt-72 text-center">
				<h2 className="text-4xl font-serif text-blue-800">
					{currentClass.className}
				</h2>
			</div>
			<div>
				{currentClass.quizzes && currentClass.quizzes.length > 0 && (
					<QuizContainer quizzes={currentClass.quizzes} />
				)}
			</div>
		</section>
	);
};

export default ClassLayout;
