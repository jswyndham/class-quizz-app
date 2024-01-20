import React from 'react';
import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { MdAdminPanelSettings } from 'react-icons/md';
import { USER_STATUS } from '../../../server/utils/constants';

const links = [
	{
		text: 'all quizzes',
		path: '.',
		icon: <FaWpforms />,
		role: [
			USER_STATUS.ADMIN.value,
			USER_STATUS.TEACHER.value,
			USER_STATUS.STUDENT.value,
		],
	},
	{
		text: 'all classes',
		path: 'all-classes',
		icon: <FaWpforms />,
		role: [
			USER_STATUS.ADMIN.value,
			USER_STATUS.TEACHER.value,
			USER_STATUS.STUDENT.value,
		],
	},

	{
		text: 'add class',
		path: 'add-class',
		icon: <MdQueryStats />,
		role: [USER_STATUS.ADMIN.value, USER_STATUS.TEACHER.value],
	},
	{
		text: 'add quiz',
		path: 'add-quiz',
		icon: <MdQueryStats />,
		role: [USER_STATUS.ADMIN.value, USER_STATUS.TEACHER.value],
	},
	{
		text: 'stats',
		path: 'stats',
		icon: <IoBarChartSharp />,
		role: [USER_STATUS.ADMIN.value, USER_STATUS.TEACHER.value],
	},
	{
		text: 'settings',
		path: 'profile',
		icon: <ImProfile />,
		role: [
			USER_STATUS.ADMIN.value,
			USER_STATUS.TEACHER.value,
			USER_STATUS.STUDENT.value,
		],
	},
	{
		text: 'admin',
		path: 'admin',
		icon: <MdAdminPanelSettings />,
		role: [USER_STATUS.ADMIN.value],
	},
];

export default links;
