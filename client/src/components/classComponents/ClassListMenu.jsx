import { memo, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import ClassListCard from './ClassListCard';
import { fetchCurrentUser } from '../../features/user/userAPI';
import { fetchClasses } from '../../features/classGroup/classAPI';
import LoadingSpinner from '../LoadingSpinner';

const MemoizedClassListCard = memo(ClassListCard);

const ClassListMenu = () => {
	const { id } = useParams();

	const { userData, classData, loading } = useSelector(
		(state) => ({
			userData: state.user.currentUser,
			classData: state.class.class,
			loading: state.class.loading,
		}),
		shallowEqual
	);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!userData) {
			dispatch(fetchCurrentUser(id));
		}
	}, [dispatch, id]);

	useEffect(() => {
		dispatch(fetchClasses());
	}, [dispatch]);

	// Loading spinner
	if (loading) {
		return <LoadingSpinner />;
	}

	// NO CLASSES TO DISPLAY
	// if (classData.length === 0) {
	// 	return (
	// 		<div className="h-screen w-80 flex justify-center">
	// 			<h2 className="text-3xl font-display font-bold italic mt-44">
	// 				No classes to display.
	// 			</h2>
	// 		</div>
	// 	);
	// }

	// Map list of class groups
	return (
		<article className="invisible md:visible md:transition-transform md:duration-300 fixed flex-shrink-0 w-64 h-screen mt-28 py-4 px-1 border-r-2 bg-zinc-200 border-third shadow-md shadow-slate-300">
			<div className="m-2">
				<h2 className="font-quizgate text-2xl">Class List</h2>
			</div>
			<div className="w-full h-fit grid grid-cols-1">
				{classData.map((classGroup) => (
					<MemoizedClassListCard
						key={classGroup._id}
						{...classGroup}
					/>
				))}
			</div>
		</article>
	);
};

export default ClassListMenu;
