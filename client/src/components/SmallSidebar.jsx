import { FaTimes } from 'react-icons/fa';
import { forwardRef } from 'react';
import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/images/quizgate-logo.png';
import DashboardLayoutHooks from '../hooks/DashboardLayoutHooks';

// Passing the sideMenuRef down to the root DOM element (DashboardLayout) using forwardRef (must accept two arguments).
const SmallSidebar = forwardRef((props, sideMenuRef) => {
	const { showSidebar, toggleSidebar } = DashboardLayoutHooks({});

	return (
		<section
			ref={sideMenuRef}
			className={showSidebar ? 'visible ' : 'invisible '}
		>
			<article className="relative">
				<div className="fixed h-full w-full top-0 left-0 bg-gray-700 inset-0 opacity-70 z-40"></div>
				<div
					className={
						showSidebar
							? 'w-80 h-screen bg-third shadow-xl shadow-gray-800 transition-all ease-in-out duration-300 left-0 z-50 fixed'
							: 'w-96 h-screen transition-all ease-in-out duration-300 -left-96 z-50 fixed'
					}
				>
					<div className="flex justify-between">
						{/* LOGO HEADER */}
						<header className="flex text-center text-3xl text-blue-700 m-6 font-extrabold">
							<img
								src={logo}
								alt="QuizGate logo"
								className="flex h-8 md:h-16 md:-mt-4"
							/>
						</header>

						{/* CLOSE BUTTON */}
						<button
							type="button"
							onClick={toggleSidebar}
							className="mt-2 mr-8 text-red-700 text-2xl hover:text-red-500"
						>
							<FaTimes />
						</button>
					</div>

					{/* TOGGLE DARK THEME */}
					<ThemeToggle />

					{/* LINK LIST in NavLinks component*/}
					<NavLinks />
				</div>
			</article>
		</section>
	);
});

export default SmallSidebar;
