import React from 'react';

import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { MdAdminPanelSettings } from 'react-icons/md';

const links = [
	{
		text: 'all class',
		path: '.',
		icon: <FaWpforms />,
	},
	{
		text: 'all quiz',
		path: 'all-quizzes',
		icon: <FaWpforms />,
	},
	{
		text: 'add class',
		path: 'add-class',
		icon: <MdQueryStats />,
	},
	{
		text: 'add quiz',
		path: 'add-quiz',
		icon: <MdQueryStats />,
	},
	{
		text: 'stats',
		path: 'stats',
		icon: <IoBarChartSharp />,
	},
	{
		text: 'profile',
		path: 'profile',
		icon: <ImProfile />,
	},
	{
		text: 'admin',
		path: 'admin',
		icon: <MdAdminPanelSettings />,
	},
];

export default links;
