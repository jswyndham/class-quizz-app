export const CLASS_SORT_BY = {
	NEWEST_FIRST: 'newest',
	OLDEST_FIRST: 'oldest',
	ASCENDING: 'a-z',
	DESCENDING: 'z-a',
};

// User status assigned when users signup
export const USER_STATUS = {
	STUDENT: { value: 'STUDENT', label: 'student' },
	TEACHER: { value: 'TEACHER', label: 'teacher' },
	ADMIN: { value: 'ADMIN', label: 'admin' },
};

// Quiz question type
export const QUESTION_TYPE = {
	MULTIPLE_CHOICE: { value: 'MULTIPLE_CHOICE', label: 'multiple choice' },
	LONG_ANSWER: { value: 'LONG_ANSWER', label: 'long answer' },
};

// Member status for admin group members
export const ADMIN_STATUS = {
	SITE_MANAGER: {
		value: 'SITE_MANAGER',
		label: 'site manager',
	},
	USER_MODERATOR: {
		value: 'USER_MODERATOR',
		label: 'user moderator',
	},
	CONTENT_OVERSEER: {
		value: 'CONTENT_OVERSEER',
		label: 'content overseer',
	},
	SUPER_ADMIN: {
		value: 'SUPER_ADMIN',
		label: 'super admin',
	},
};

// Member status for teachers
export const MEMBER_STATUS = {
	FREE_TIER: {
		value: 'FREE_TIER',
		label: 'free tier',
	},
	PAID_TIER: { value: 'PAID_TIER', label: 'paid tier' },
};

// Role permissions for USER_STATUS
export const ROLE_PERMISSIONS = {
	ADMIN: [
		'TRANSFER_ADMIN_RIGHTS',
		'MANAGE_USERS',
		'MANAGE_CLASSES',
		'VIEW_ALL_DATA',
		'CREATE_CLASS',
		'CREATE_QUIZ',
		'COPY_QUIZ',
		'UPDATE_CLASS',
		'UPDATE_QUIZ',
		'DELETE_CLASS',
		'DELETE_QUIZ',
		'MANAGE_QUIZZES',
		'JOIN_CLASS',
		'GET_SINGLE_STUDENT',
		'GET_ALL_STUDENTS',
		'GET_CLASS_MEMBERS',
		'GET_ALL_STUDENT_MEMBERSHIPS',
		'GET_STUDENT_PERFORMANCE',
		'DELETE_CLASS_MEMBERSHIP',
		'GET_ALL_TEACHERS',
		'GET_ALL_ADMIN',
		'GET_SINGLE_ADMIN',
		'GET_USER_MEMBERSHIP',
	],
	TEACHER: [
		'TRANSFER_ADMIN_RIGHTS',
		'CREATE_CLASS',
		'CREATE_QUIZ',
		'COPY_QUIZ',
		'UPDATE_CLASS',
		'UPDATE_QUIZ',
		'DELETE_CLASS',
		'DELETE_QUIZ',
		'MANAGE_QUIZZES',
		'JOIN_CLASS',
		'GET_SINGLE_STUDENT',
		'GET_CLASS_MEMBERS',
		'GET_USER_MEMBERSHIP',
		'GET_ALL_STUDENT_MEMBERSHIPS',
		'GET_STUDENT_PERFORMANCE',
		'DELETE_CLASS_MEMBERSHIP',
	],
	STUDENT: [
		'JOIN_CLASS',
		'CREATE_MEMBERSHIP',
		'GET_USER_MEMBERSHIP',
		'GET_CLASS_MEMBERS',
		'TAKE_QUIZ',
	],
};
