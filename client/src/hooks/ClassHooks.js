import { useState } from 'react';

const classHooks = (initialClassData = {}) => {
	const [classGroup, setClassGroup] = useState({
		className: initialClassData.className || '',
		subject: initialClassData.subject || '',
		school: initialClassData.school || '',
		quizzes: initialClassData.quizzes || [],
		students: initialClassData.students || [],
	});

	// Set class title
	const setClassName = (e) => {
		setClassGroup((prevClass) => ({
			...prevClass,
			className: e.target.value,
		}));
	};

	// Set class subject
	const setClassSubject = (e) => {
		setClassGroup((prevClass) => ({
			...prevClass,
			subject: e.target.value,
		}));
	};

	// Set class school name
	const setClassSchool = (e) => {
		setClassGroup((prevClass) => ({
			...prevClass,
			school: e.target.value,
		}));
	};

	return {
		setClassName,
		setClassSubject,
		setClassName,
		setClassSchool,
		setClassGroup,
		classGroup,
	};
};

export default classHooks;
