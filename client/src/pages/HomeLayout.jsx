import React from 'react';
import { Outlet } from 'react-router';

const HomeLayout = () => {
	return (
		<main className="h-full w-screen">
			<nav>Navbar</nav>
			{/* Outlet will display the children pages */}
			<Outlet />
		</main>
	);
};

export default HomeLayout;
