import React from 'react';
import { Outlet } from 'react-router';

const HomeLayout = () => {
	return (
		<main className="h-screen w-screen dark:bg-gray-700">
			{/* Outlet will display the children pages */}

			<Outlet />
		</main>
	);
};

export default HomeLayout;
