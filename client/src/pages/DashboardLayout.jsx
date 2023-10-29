import React from 'react';
import { Outlet } from 'react-router';
import { BigSidebar, SmallSidebar, Navbar } from '../components';

const DashboardLayout = () => {
	return (
		<main>
			<SmallSidebar />
			<BigSidebar />
			<div>
				<Navbar />
				<div>
					<Outlet />
				</div>
			</div>
		</main>
	);
};

export default DashboardLayout;
