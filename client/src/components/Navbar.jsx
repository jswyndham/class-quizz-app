import { FaAlignLeft } from 'react-icons/fa';
import { useDashboardContext } from '../pages/DashboardLayout';
import LogoutContainer from './LogoutContainer';

const Navbar = () => {
	const { toggleSidebar } = useDashboardContext();
	return (
		<nav className="absolute top-0 right-0 flex justify-between h-28 w-screen bg-blue-200 dark:bg-gray-800 pl-12 py-9 font-extrabold">
			<button
				type="button"
				className="xl:invisible text-2xl text-blue-900"
				onClick={toggleSidebar}
			>
				<FaAlignLeft />
			</button>
			<div>
				<h2 className="text-3xl dark:text-white">Navbar</h2>
			</div>
			<div className="mx-4">
				<LogoutContainer />
			</div>
		</nav>
	);
};

export default Navbar;
