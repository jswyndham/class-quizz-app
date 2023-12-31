import { useEffect, memo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import ClassCard from './ClassCard';
import { fetchClasses } from '../features/classGroup/classAPI';
import { fetchCurrentUser } from '../features/users/userAPI';
import { useParams } from 'react-router';

const MemoizedClassCard = memo(ClassCard);

const ClassContainer = () => {
	const { userData, classData } = useSelector(
		(state) => ({
			userData: state.class.currentUser,
			classData: state.class.class,
			loading: state.class.loading,
		}),
		shallowEqual
	);

	console.log('CLASS DATA: ', classData);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!userData) {
			dispatch(fetchCurrentUser());
		}
	}, []);

	useEffect(() => {
		dispatch(fetchClasses());
	}, []);

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
		<section className="flex justify-center h-screen w-screen pt-36 px-4">
			<div className="2xl:w-7/12 w-full h-fit mx-2 md:mx-12 grid grid-cols-1 2xl:grid-rows-2 gap-4">
				{classData.map((classGroup) => (
					<MemoizedClassCard key={classGroup._id} {...classGroup} />
				))}
			</div>
		</section>
	);
};

export default ClassContainer;
