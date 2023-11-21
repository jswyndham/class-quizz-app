import { FaAlignLeft } from 'react-icons/fa';
import { useDashboardContext } from '../pages/DashboardLayout';
import LogoutContainer from './LogoutContainer';
import logo from '../assets/images/slogan_main.png';

const Navbar = () => {
	const { toggleSidebar } = useDashboardContext();
	return (
		<nav className="absolute top-0 right-0 flex justify-between h-28 w-screen bg-primary text-cream dark:bg-gray-800 pl-12 py-9 font-extrabold">
			<button
				type="button"
				className="xl:invisible text-cream text-2xl"
				onClick={toggleSidebar}
			>
				<FaAlignLeft />
			</button>

			<img
				src={logo}
				alt="teacher test creator slogan"
				className="flex h-8 md:h-16 md:-mt-4"
			/>

			<div className="mx-4">
				<LogoutContainer />
			</div>
		</nav>
	);
};

export default Navbar;
