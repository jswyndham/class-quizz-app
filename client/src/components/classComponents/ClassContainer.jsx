import { useEffect, memo, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import ClassCard from './ClassCard';
import { fetchClasses } from '../../features/classGroup/classAPI';
import { fetchCurrentUser } from '../../features/user/userAPI';
import LoadingSpinner from '../LoadingSpinner';
import { useParams } from 'react-router';

const MemoizedClassCard = memo(ClassCard);

const ClassContainer = () => {
	const { id } = useParams();
	const { userData, classData, loading } = useSelector((state) => {
		const selectedData = {
			userData: state.user.currentUser,
			classData: state.class.classesById,
			loading: state.class.loading,
		};

		return selectedData;
	}, shallowEqual);

	const classDataArray = useMemo(() => Object.values(classData), [classData]); // Convert object to array and useMemo() to prevent re-rendering

	const dispatch = useDispatch();

	// useEffect(() => {
	// 	if (!userData) {
	// 		console.log(
	// 			'useEffect triggered for currentUser - ClassContainer',
	// 			{
	// 				currentUser,
	// 				id,
	// 			}
	// 		);
	// 		dispatch(fetchCurrentUser(id));
	// 	}
	// }, [currentUser, id, dispatch]);

	useEffect(() => {
		console.log('Dispatching fetchClasses - ClassContainer');
		dispatch(fetchClasses());
	}, [dispatch]);

	// Loading spinner
	if (loading) {
		return <LoadingSpinner />;
	}

	// NO CLASSES TO DISPLAY
	if (classDataArray.length === 0) {
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
				{classDataArray.map((classGroup) => (
					<MemoizedClassCard key={classGroup._id} {...classGroup} />
				))}
			</div>
		</section>
	);
};

export default ClassContainer;
