import { useDashboardContext } from '../pages/DashboardLayout';
import links from '../utils/links';
import { NavLink } from 'react-router-dom';

const NavLinks = ({ closeSidebar }) => {
	const { user } = useDashboardContext();
	return (
		<div className="flex flex-col mt-8 ml-12 mr-4 text-primary">
			{links.map((link) => {
				const { text, path, icon } = link;

				if (user && path === 'admin' && user.role !== 'admin') return;
				return (
					<NavLink
						to={path}
						key={text}
						className="flex flex-row hover:text-primary_yellow"
						onClick={() => closeSidebar()}
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
