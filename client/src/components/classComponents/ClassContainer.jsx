import { useEffect, memo, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import ClassCard from './ClassCard';
import { fetchClasses } from '../../features/classGroup/classAPI';
import { fetchCurrentUser } from '../../features/user/userAPI';
import LoadingSpinner from '../LoadingSpinner';
import { useParams } from 'react-router';
import { selectClassDataArray } from '../../features/classGroup/classSelectors';

const MemoizedClassCard = memo(ClassCard);

const ClassContainer = () => {
	const { id } = useParams();

	const classData = useSelector(selectClassDataArray);
	const userData = useSelector((state) => state.user.currentUser);
	const isLoading = useSelector((state) => state.class.loading);
	const { error } = useSelector((state) => state.class);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchClasses());
	}, [dispatch]);

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

	// NO CLASSES TO DISPLAY
	if (classData.length === 0) {
		return (
			<div className="h-screen w-screen flex justify-center">
				<h2 className="text-3xl font-display font-bold italic mt-44">
					You currently have no classes to display.
				</h2>
			</div>
		);
	}

	// RETURN CLASSES ARRAY
	return (
		<section className="flex justify-center h-screen w-full pt-36 md:px-4">
			<div className="lg:w-10/12 w-full h-fit md:mx-2 grid grid-cols-1 2xl:grid-cols-2 gap-4">
				{classData.map((classGroup) => (
					<MemoizedClassCard key={classGroup._id} {...classGroup} />
				))}
			</div>
		</section>
	);
};

export default ClassContainer;
