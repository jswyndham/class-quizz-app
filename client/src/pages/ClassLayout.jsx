import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassById } from '../features/classGroup/classAPI';
// import QuizContainer from '../components/QuizContainer';
import { useParams } from 'react-router-dom';

const ClassLayout = () => {
	const { id, className, subject, school } = useParams();
	const dispatch = useDispatch();
	const currentClass = useSelector((state) => state.class.currentClass);
	const { loading, error } = useSelector((state) => state.class);

	useEffect(() => {
		dispatch(fetchClassById(id));
	}, [dispatch]);

	if (loading) return <div>Loading class...</div>;
	if (error) return <div>Error: {error}</div>;

	console.log('CURRENT CLASS STATUS: ', currentClass);

	console.log('Class ID from URL:', id);
	console.log('Class NAME from URL:', className);
	console.log('Class SUBJECT from URL:', subject);
	console.log('Class SCHOOL from URL:', school);

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
		<section className="w-screen h-screen flex justify-center align-middle">
			<div className="mt-56">
				<h2 className="text-4xl font-serif text-blue-800">
					{className}
				</h2>
				{/* other class details */}
			</div>
			<div>{/* <QuizContainer /> */}</div>
		</section>
	);
};

export default ClassLayout;
