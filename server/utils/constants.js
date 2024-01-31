export const CLASS_SORT_BY = {
	NEWEST_FIRST: 'newest',
	OLDEST_FIRST: 'oldest',
	ASCENDING: 'a-z',
	DESCENDING: 'z-a',
};

export const USER_STATUS = {
	STUDENT: { value: 'STUDENT', label: 'student' },
	TEACHER: { value: 'TEACHER', label: 'teacher' },
	ADMIN: { value: 'ADMIN', label: 'admin' },
};

export const QUESTION_TYPE = {
	MULTIPLE_CHOICE: { value: 'MULTIPLE_CHOICE', label: 'multiple choice' },
	SHORT_ANSWER: { value: 'SHORT_ANSWER', label: 'short answer' },
	LONG_ANSWER: { value: 'LONG_ANSWER', label: 'long answer' },
};

export const ROLE_PERMISSIONS = {
	ADMIN: [
		'MANAGE_USERS',
		'MANAGE_CLASSES',
		'VIEW_ALL_DATA',
		'CREATE_CLASS',
		'CREATE_QUIZ',
		'UPDATE_CLASS',
		'UPDATE_QUIZ',
		'DELETE_CLASS',
		'DELETE_QUIZ',
		'MANAGE_QUIZZES',
		'JOIN_CLASS',
		'GET_CLASS_MEMBERS',
		'GET_ALL_STUDENT_MEMBERSHIPS',
		'DELETE_CLASS_MEMBERSHIP',
	],
	TEACHER: [
		'CREATE_CLASS',
		'CREATE_QUIZ',
		'UPDATE_CLASS',
		'UPDATE_QUIZ',
		'DELETE_CLASS',
		'DELETE_QUIZ',
		'MANAGE_QUIZZES',
		'JOIN_CLASS',
		'GET_CLASS_MEMBERS',
		'GET_ALL_STUDENT_MEMBERSHIPS',
		'DELETE_CLASS_MEMBERSHIP',
	],
	STUDENT: ['JOIN_CLASS', 'GET_CLASS_MEMBERS', 'TAKE_QUIZ'],
};
