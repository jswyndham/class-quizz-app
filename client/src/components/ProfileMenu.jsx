import React from 'react';
import { useDashboardContext } from '../pages/DashboardLayout';

const ProfileMenu = () => {
	const { showLogout, setShowLogout } = useDashboardContext();
	return (
		<section className={showLogout ? 'visible ' : 'invisible '}>
			<article className="relative">
				<div className="absolute h-screen w-screen bg-gray-700 bg-blend-overlay inset-0 opacity-70"></div>
				<div
					className={
						showLogout
							? 'w-96 h-screen bg-blue-300 shadow-xl shadow-gray-800 transition-all ease-in-out duration-300 left-0 z-50 fixed'
							: 'w-96 h-screen transition-all ease-in-out duration-300 -left-96 z-50 fixed'
					}
				>
					{/* LINK LIST in NavLinks component*/}
					<NavLinks />
				</div>
			</article>
		</section>
	);
};

export default ProfileMenu;
