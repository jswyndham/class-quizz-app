import { FiMenu } from 'react-icons/fi';
import logo from '../assets/images/quizgate-logo.png';

const Navbar = ({ toggleSidebar }) => {
	return (
		<nav className="fixed top-0 flex justify-between h-32 w-screen bg-third text-forth dark:bg-gray-800 font-extrabold z-30">
			<div className="flex items-center ml-4 lg:ml-8">
				<img src={logo} alt="QuizGate logo" className="h-12 md:h-16" />
			</div>

			<div className="flex items-center mr-8">
				<button
					type="button"
					className="text-primary text-4xl hover:cursor-pointer"
					onClick={toggleSidebar}
				>
					<FiMenu />
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
