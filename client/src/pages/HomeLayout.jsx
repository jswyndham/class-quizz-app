import React from 'react';
import { Outlet } from 'react-router';

const HomeLayout = () => {
	return (
		<main className="h-screen w-screen">
			<nav className="h-24 w-screen bg-blue-200 mb-12 pl-12 py-9 flex justify-start font-extrabold">
				Navbar
			</nav>
			{/* Outlet will display the children pages */}
			<Outlet />
		</main>
	);
};

export default HomeLayout;
