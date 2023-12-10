import { useState } from 'react';

const classHooks = (initialClassData) => {
	const [className, setClassName] = useState(
		initialClassData.className || ''
	);
	const [subject, setSubject] = useState(initialClassData.subject || '');
	const [classStatus, setClassStatus] = useState(
		initialClassData.classStatus || ''
	);
	const [school, setSchool] = useState(initialClassData.school || '');

	// ON CHANGE
	const onNameChanged = (e) => setClassName(e.target.value);
	const onSubjectChanged = (e) => setSubject(e.target.value);
	const onSchoolChanged = (e) => setSchool(e.target.value);
	const onClassStatusChanged = (e) => setClassStatus(e.target.value);

	return {
		onNameChanged,
		onSubjectChanged,
		onSchoolChanged,
		onClassStatusChanged,
		setClassName,
		setSubject,
		setClassStatus,
		setSchool,
		className,
		subject,
		classStatus,
		school,
	};
};

export default classHooks;
