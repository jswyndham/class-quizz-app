import React from 'react';

import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { MsAdminPanelSettings } from 'react-icons/md';

const links = [
	{
		text: 'add test',
		path: '.',
		icon: <FaWpforms />,
	},
	{
		text: 'all tests',
		path: 'alltests',
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
		icon: <MsAdminPanelSettings />,
	},
];

export default links;
