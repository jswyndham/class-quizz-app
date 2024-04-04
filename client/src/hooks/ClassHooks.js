import { useState } from 'react';

const classHooks = (initialClassData = {}) => {
	const [classGroup, setClassGroup] = useState({
		className: initialClassData.className || '',
		subject: initialClassData.subject || '',
		school: initialClassData.school || '',
		quizzes: initialClassData.quizzes || [],
		students: initialClassData.students || [],
		dayOfTheWeek: initialClassData.dayOfTheWeek || '',
		is24Hour: initialClassData.is24Hour || false, // false for 12-hour format
		classTime: initialClassData.classTime || {
			start: startTime instanceof Date ? startTime.toISOString() : '',
			end: endTime instanceof Date ? endTime.toISOString() : '',
		},
	});

	const [selectedDayOfTheWeek, setSelectedDayOfTheWeek] = useState('');

	// Function to update is24Hour setting
	const setIs24HourSetting = (is24HourSetting) => {
		setClassGroup((prevClassGroup) => ({
			...prevClassGroup,
			is24Hour: is24HourSetting,
		}));
	};

	const [startTime, setStartTime] = useState(
		new Date(initialClassData.classTime?.start || new Date())
	);
	const [endTime, setEndTime] = useState(
		new Date(initialClassData.classTime?.end || new Date())
	);

	// Set class title
	const setClassName = (className) => {
		setClassGroup((prevClass) => ({
			...prevClass,
			className,
		}));
	};

	// Set class subject
	const setClassSubject = (subject) => {
		setClassGroup((prevClass) => ({
			...prevClass,
			subject,
		}));
	};

	// Set class school name
	const setClassSchool = (school) => {
		setClassGroup((prevClass) => ({
			...prevClass,
			school,
		}));
	};

	// Hook for dayOfTheWeek
	const setDayOfTheWeek = (dayOfTheWeek) => {
		setClassGroup(
			(prevClass) => ({
				...prevClass,
				dayOfTheWeek,
			}),
			console.log('setDayOfTheWeek in classHooks: ', day)
		);
	};

	// Hook for classTime
	const setClassTime = (start, end) => {
		setClassGroup((prevClass) => ({
			...prevClass,
			classTime: { start, end },
		}));
	};

	return {
		setClassName,
		setClassSubject,
		setClassName,
		setClassSchool,
		setClassGroup,
		setDayOfTheWeek,
		setClassTime,
		startTime,
		setStartTime,
		endTime,
		setEndTime,
		classGroup,
		selectedDayOfTheWeek,
		setSelectedDayOfTheWeek,
		setStartTime,
		setEndTime,
		setIs24HourSetting,
	};
};

export default classHooks;
