import { FiMenu } from 'react-icons/fi';
import logo from '../assets/images/quizgate-logo.png';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
	return (
		<nav className="fixed top-0 flex justify-between h-32 w-screen bg-third text-forth dark:bg-gray-800 font-extrabold z-30">
			<div className="flex items-center ml-5 md:ml-10">
				<Link to="/dashboard">
					<img
						src={logo}
						alt="QuizGate logo"
						className="h-12 md:h-16"
					/>
				</Link>
			</div>

			<div className="flex items-center mr-8">
				<button
					type="button"
					className="text-primary text-4xl md:text-5xl hover:cursor-pointer hover:text-yellow-200"
					onClick={toggleSidebar}
				>
					<FiMenu />
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
