import { FaTimes } from 'react-icons/fa';
import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/images/quizgate-logo.png';
import LogoutContainer from './LogoutContainer';

// Passing the sideMenuRef down to the root DOM element (DashboardLayout) using forwardRef (must accept two arguments).
const SmallSidebar = ({ showSidebar, toggleSidebar, sidebarRef }) => {
	console.log('showSidebar in SmallSidebar component:', showSidebar);

	return (
		<section
			ref={sidebarRef}
			className={showSidebar ? 'visible' : 'invisible'}
		>
			<article className="relative">
				<div className="fixed h-full w-full top-0 left-0 bg-gray-700 inset-0 opacity-70 z-40"></div>
				<div
					className={
						showSidebar
							? 'w-80 h-screen bg-third shadow-xl shadow-gray-800 transition-all ease-in-out duration-300 right-0 z-50 fixed'
							: 'w-96 h-screen transition-all ease-in-out duration-300 -right-96 z-50 fixed'
					}
				>
					<div className="flex justify-between">
						{/* CLOSE BUTTON */}
						<button
							type="button"
							onClick={toggleSidebar}
							className="-mt-1 ml-5 text-red-700 text-2xl hover:text-red-500"
						>
							<FaTimes />
						</button>

						{/* LOGO HEADER */}
						<header className="flex text-center m-3 ">
							<img
								src={logo}
								alt="QuizGate logo"
								className="flex h-10"
							/>
						</header>
					</div>

					{/* TOGGLE DARK THEME */}
					<div className="-mb-5 ml-2 mt-2">
						<ThemeToggle />
					</div>

					{/* LINK LIST in NavLinks component*/}
					<NavLinks closeSidebar={toggleSidebar} />

					<div className="flex justify-start ml-10">
						<LogoutContainer />
					</div>
				</div>
			</article>
		</section>
	);
};

export default SmallSidebar;
