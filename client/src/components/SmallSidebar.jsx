import { FaTimes } from 'react-icons/fa';
import { useDashboardContext } from '../pages/DashboardLayout';
import NavLinks from './NavLinks';

const SmallSidebar = () => {
	const { showSidebar, toggleSidebar } = useDashboardContext();

	return (
		<section className={showSidebar ? 'visible ' : 'invisible '}>
			<article className="relative">
				<div className="absolute h-screen w-screen bg-gray-700 bg-blend-overlay inset-0 opacity-70"></div>
				<div
					className={
						showSidebar
							? 'w-96 h-screen bg-blue-300 shadow-xl shadow-gray-800 transition-all ease-in-out duration-300 left-0 z-50 fixed'
							: 'w-96 h-screen transition-all ease-in-out duration-300 -left-96 z-50 fixed'
					}
				>
					<div className="flex justify-between">
						{/* LOGO HEADER */}
						<header className="flex text-center text-3xl text-blue-700 m-6 font-extrabold">
							LOGO
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

					{/* LINK LIST in NavLinks component*/}
					<NavLinks />
				</div>
			</article>
		</section>
	);
};

export default SmallSidebar;
