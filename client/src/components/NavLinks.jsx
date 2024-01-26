import { useDispatch, useSelector } from 'react-redux';
import links from '../utils/links';
import { NavLink } from 'react-router-dom';
import { fetchCurrentUser } from '../features/user/userAPI';
import { useEffect } from 'react';

const NavLinks = ({ closeSidebar }) => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.currentUser);

	useEffect(() => {
		if (!currentUser) {
			dispatch(fetchCurrentUser());
		}
	}, [currentUser, dispatch]);

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
						<span className="text-3xl my-6 mr-3">{icon}</span>
						<span className="text-xl my-6">{text}</span>
					</NavLink>
				);
			})}
		</div>
	);
};

export default NavLinks;
