import { FaAlignLeft } from 'react-icons/fa';
import { useDashboardContext } from '../pages/DashboardLayout';

const Navbar = () => {
	const { toggleSidebar } = useDashboardContext();
	return (
		<nav className="absolute top-0 right-0 flex justify-between h-24 w-screen xl:w-5/6 2xl:w-11/12 bg-blue-200 mb-12 pl-12 py-9 font-extrabold">
			<button
				type="button"
				className="xl:invisible text-2xl text-blue-900"
				onClick={toggleSidebar}
			>
				<FaAlignLeft />
			</button>
			<div>
				<h2>Navbar</h2>
			</div>
			<div className="mx-4">
				<h3>toggle/logout</h3>
			</div>
		</nav>
	);
};

export default Navbar;
