import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addClass, selectClass } from '../features/classGroup/classSlice';
import ClassDisplay from './ClassDisplay';

const ClassGroup = () => {
	const { classGroup } = useSelector((store) => store.class);
	const currentClass = useSelector((store) => store.class.currentClass);
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
		<main>
			{/* <div>
						{classGroup.map((class) => {return <ClassDisplay key={class.id} {...class} />})}
				</div>  */}
		</main>
	);
};

export default ClassGroup;
