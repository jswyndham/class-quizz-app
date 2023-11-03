import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addClass, selectClass } from '../features/classGroup/classSlice';
import ClassDisplay from './ClassDisplay';

const ClassGroup = () => {
	const { classGroups } = useSelector((store) => store.classes);
	const currentClass = useSelector((store) => store.classes.currentClass);
	const dispatch = useDispatch();

	const [newClassName, setNewClassName] = useState('');

	const handleAddClass = () => {
		dispatch(addClass(newClassName));
		setNewClassName('');
	};

	const handleSelectClass = (id) => {
		dispatch(selectClass(id));
	};

	return (
		<section>
			<div>
				{classGroups.map((classes) => {
					return <ClassDisplay key={classes.id} {...classes} />;
				})}
			</div>
		</section>
	);
};

export default ClassGroup;
