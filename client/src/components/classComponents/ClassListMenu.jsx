import { memo, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import ClassListCard from './ClassListCard';
import { fetchCurrentUser } from '../../features/user/userAPI';
import { fetchClasses } from '../../features/classGroup/classAPI';
import LoadingSpinner from '../LoadingSpinner';
import AddButton from '../AddButton';
import ButtonMenu from '../ButtonMenu';

const MemoizedClassListCard = memo(ClassListCard);

const ClassListMenu = () => {
	const { id } = useParams();

	const userData = useSelector((state) => state.class.currentUser);
	const loading = useSelector((state) => state.class.loading);
	const classData = useSelector((state) => state.class.class);

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

	// Map list of class groups
	return (
		<article className="invisible md:visible md:transition-transform md:duration-300 fixed flex-shrink-0 w-64 h-screen mt-24 py-4 px-1 border-r-2 bg-zinc-200 border-third shadow-md shadow-slate-300">
			<div>
				<AddButton text="Class" />
			</div>
			<div className="absolute w-full top-2 right-2">
				<ButtonMenu />
			</div>
			<div className="m-2 border-t border-slate-400">
				<h2 className="pt-4 font-quizgate text-2xl tracking-wide">
					Class List
				</h2>
			</div>
			<div className="w-full h-fit grid grid-cols-1">
				{Array.isArray(classData) &&
					classData.map((classGroup) => (
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
