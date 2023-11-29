import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ClassCard from './ClassCard';
import { fetchClasses } from '../features/classGroup/classAPI';

const ClassContainer = () => {
	const { classes } = useSelector((state) => state.class);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchClasses());
	}, [dispatch]);

	console.log('classes: ', classes);

	// NO CLASSES TO DISPLAY
	if (classes.length === 0) {
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
				{classes.map((classGroup) => {
					return <ClassCard key={classGroup._id} {...classGroup} />;
				})}
			</div>
		</section>
	);
};

export default ClassContainer;
