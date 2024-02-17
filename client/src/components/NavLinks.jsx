import { useDispatch, useSelector } from 'react-redux';
import links from '../utils/links';
import { NavLink } from 'react-router-dom';

const NavLinks = ({ closeSidebar }) => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.currentUser);

	if (!currentUser) {
		return <div>Loading...</div>;
	}

	const filteredLinks = links.filter((link) => {
		return link.role.includes(currentUser.userStatus);
	});

	return (
		<div className="flex flex-col mt-8 ml-12 mr-4 text-primary ">
			{filteredLinks.map((link) => {
				const { text, path, icon } = link;
				return (
					<NavLink
						to={path}
						key={text}
						className="flex flex-row hover:text-yellow-200"
						onClick={() => closeSidebar()}
					>
						<span className="text-3xl my-4 mr-3">{icon}</span>
						<span className="text-xl my-4">{text}</span>
					</NavLink>
				);
			})}
		</div>
	);
};

export default NavLinks;
