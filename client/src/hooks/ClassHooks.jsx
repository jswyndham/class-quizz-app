import { useState } from 'react';

const classHooks = (initialValues) => {
	const [className, setClassName] = useState(initialValues.className || '');
	const [subject, setSubject] = useState(initialValues.subject || '');
	const [classStatus, setClassStatus] = useState(
		initialValues.classStatus || ''
	);
	const [school, setSchool] = useState(initialValues.school || '');

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
