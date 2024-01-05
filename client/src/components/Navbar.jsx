import { FaAlignLeft } from 'react-icons/fa';
import LogoutContainer from './LogoutContainer';
import logo from '../assets/images/quizgate-logo.png';

const Navbar = ({ toggleSidebar }) => {
	return (
		<nav className="fixed top-0 flex justify-between h-32 w-screen bg-third text-forth dark:bg-gray-800 pl-12 py-9 font-extrabold z-40">
			<button
				type="button"
				className="text-primary text-2xl hover:cursor-pointer"
				onClick={toggleSidebar}
			>
				<FaAlignLeft />
			</button>

			<img src={logo} alt="QuizGate logo" className="flex h-8 md:h-16" />

			<div className="mx-4">
				<LogoutContainer />
			</div>
		</nav>
	);
};

export default Navbar;
