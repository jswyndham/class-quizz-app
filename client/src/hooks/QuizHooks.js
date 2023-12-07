import { useState } from 'react';

const classHooks = (initialValues) => {
	const [quizTitle, setQuizTitle] = useState(initialValues.quizTitle || '');
	const [questionText, setQuestionText] = useState(
		initialValues.questionText || ''
	);
	const [quizType, setQuizType] = useState(initialValues.quizType || '');
	const [school, setSchool] = useState(initialValues.school || '');

	// ON CHANGE
	const onNameChanged = (e) => setQuizTitle(e.target.value);
	const onquestionTextChanged = (e) => setQuestionText(e.target.value);
	const onSchoolChanged = (e) => setSchool(e.target.value);
	const onQuizTypeChanged = (e) => setQuizType(e.target.value);

	return {
		onNameChanged,
		onquestionTextChanged,
		onSchoolChanged,
		onQuizTypeChanged,
		setQuizTitle,
		setQuestionText,
		setQuizType,
		setSchool,
		quizTitle,
		questionText,
		quizType,
		school,
	};
};

export default classHooks;
