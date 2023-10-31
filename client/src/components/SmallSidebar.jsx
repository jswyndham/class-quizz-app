import { FaTimes } from 'react-icons/fa';
import { useDashboardContext } from '../pages/DashboardLayout';
import links from '../utils/links';
import { NavLink } from 'react-router-dom';

const SmallSidebar = () => {
	const { showSidebar, toggleSidebar } = useDashboardContext();

	return (
		<section className={showSidebar ? 'visible ' : 'invisible '}>
			<article className="relative">
				<div className="absolute h-screen w-screen bg-gray-700 bg-blend-overlay inset-0 opacity-70"></div>
				<div
					className={
						showSidebar
							? 'relative w-96 h-screen bg-blue-300 shadow-xl shadow-gray-800 transition-all ease-in-out duration-500 left-0'
							: 'transition-all ease-in-out -left-96'
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

					{/* LINK LIST */}
					<div className="flex flex-col mt-12 ml-10 text-blue-900 ">
						{links.map((link) => {
							const { text, path, icon } = link;
							return (
								<NavLink
									to={path}
									key={text}
									className="flex flex-row hover:text-white"
									onClick={toggleSidebar}
								>
									<span className="text-3xl my-6 mr-3">
										{icon}
									</span>
									<span className="text-xl my-6">{text}</span>
								</NavLink>
							);
						})}
					</div>
				</div>
			</article>
		</section>
	);
};

export default SmallSidebar;
