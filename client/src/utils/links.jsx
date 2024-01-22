import React from 'react';
import { PiChalkboardTeacherDuotone } from 'react-icons/pi';
import { MdOutlineAddHome } from 'react-icons/md';
import { IoBarChartSharp } from 'react-icons/io5';
import { MdFormatListBulletedAdd } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { MdAdminPanelSettings } from 'react-icons/md';
import { USER_STATUS } from '../../../server/utils/constants';

const links = [
	{
		text: 'Create class',
		path: 'add-class',
		icon: <MdOutlineAddHome />,
		role: [USER_STATUS.ADMIN.value, USER_STATUS.TEACHER.value],
	},
	{
		text: 'View classes',
		path: 'all-classes',
		icon: <PiChalkboardTeacherDuotone />,
		role: [
			USER_STATUS.ADMIN.value,
			USER_STATUS.TEACHER.value,
			USER_STATUS.STUDENT.value,
		],
	},

	{
		text: 'Create quiz',
		path: 'add-quiz',
		icon: <MdFormatListBulletedAdd />,
		role: [USER_STATUS.ADMIN.value, USER_STATUS.TEACHER.value],
	},
	{
		text: 'View quizzes',
		path: '.',
		icon: <FaWpforms />,
		role: [
			USER_STATUS.ADMIN.value,
			USER_STATUS.TEACHER.value,
			USER_STATUS.STUDENT.value,
		],
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
