import { FaAlignRight } from 'react-icons/fa';
import LogoutContainer from './LogoutContainer';
import logo from '../assets/images/quizgate-logo.png';

const Navbar = ({ toggleSidebar }) => {
	return (
		<nav className="fixed top-0 flex justify-between h-32 w-screen bg-third text-forth dark:bg-gray-800 pl-12 py-9 font-extrabold z-40">
			<div>
				<img
					src={logo}
					alt="QuizGate logo"
					className="flex h-8 md:h-16"
				/>
			</div>

			<div className="flex justify-end mr-6">
				<button
					type="button"
					className="text-primary text-2xl hover:cursor-pointer"
					onClick={toggleSidebar}
				>
					<FaAlignRight />
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
