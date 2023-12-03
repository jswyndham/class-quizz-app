import React, { useState, useEffect, memo, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import ClassCard from './ClassCard';
import {
	fetchClasses,
	fetchCurrentUser,
} from '../features/classGroup/classAPI';

const MemoizedClassCard = memo(ClassCard);

const ClassContainer = () => {
	const { userData, classesData, loading } = useSelector(
		(state) => ({
			userData: state.class.currentUser,
			classesData: state.class.classes,
			loading: state.class.loading,
		}),
		shallowEqual
	);

	// const [confirmModalState, setConfirmModalState] = useState({
	// 	isOpen: false,
	// 	classId: null,
	// });

	const dispatch = useDispatch();

	useEffect(() => {
		if (!userData) {
			dispatch(fetchCurrentUser());
		}
	}, [userData, dispatch]);

	useEffect(() => {
		if (classesData.length === 0 && !loading) {
			console.log('Fetching classes...');
			dispatch(fetchClasses());
		}
	}, [classesData, loading, dispatch]);

	console.log('ClassContainer rendering with classes:', classesData);

	// const openConfirmModal = useCallback((classId) => {
	// 	setConfirmModalState({ isOpen: true, classId });
	// }, []);

	// const closeConfirmModal = useCallback(() => {
	// 	setConfirmModalState({ isOpen: false, classId: null });
	// }, []);

	// const handleDelete = async (e, classId) => {
	// 	e.stopPropagation();
	// 	try {
	// 		await dispatch(deleteClass(classId));
	// 		closeConfirmModal();
	// 		toast.success('Class deleted');
	// 	} catch (error) {
	// 		toast.error(error?.response?.data?.msg);
	// 	}
	// };

	// NO CLASSES TO DISPLAY
	if (classesData.length === 0) {
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
		<section className="flex justify-center h-screen w-screen py-36 px-4">
			<div className="2xl:w-7/12 w-full mx-2 md:mx-12 grid grid-cols-1 gap-4">
				{classesData.map((classGroup) => {
					return (
						<MemoizedClassCard
							key={classGroup._id}
							{...classGroup}
							// openConfirmModal={openConfirmModal}
						/>
					);
				})}
			</div>
			{/* {confirmModalState.isOpen && (
				<ConfirmDeleteModal
					isOpen={confirmModalState.isOpen}
					onConfirm={() => handleDelete(confirmModalState.classId)}
					onCancel={closeConfirmModal}
					message="Are you sure you want to delete this class?"
				/>
			)} */}
		</section>
	);
};

export default ClassContainer;
