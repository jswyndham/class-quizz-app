import { useDashboardContext } from '../pages/DashboardLayout';
import links from '../utils/links';
import { NavLink } from 'react-router-dom';

const NavLinks = () => {
	const { toggleSidebar } = useDashboardContext();
	return (
		<div className="flex flex-col mt-8 ml-10 text-blue-900 dark:text-blue-300">
			{links.map((link) => {
				const { text, path, icon } = link;
				return (
					<NavLink
						to={path}
						key={text}
						className="flex flex-row hover:text-white"
						onClick={toggleSidebar}
					>
						<span className="text-3xl my-6 mr-3">{icon}</span>
						<span className="text-xl my-6">{text}</span>
					</NavLink>
				);
			})}
		</div>
	);
};

export default NavLinks;
