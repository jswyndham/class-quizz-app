import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useDashboardContext } from '../pages/DashboardLayout';
import ProfileMenu from './ProfileMenu';

const LogoutContainer = () => {
	const { user, logoutUser } = useDashboardContext();

	return (
		<div>
			<button
				type="button"
				className="flex flex-row justify-evenly pt-2 -mt-2 h-10 w-fit rounded-lg bg-white text-blue-800 drop-shadow-md shadow-sm shadow-gray-400"
				onClick={() => setShowLogout(!showLogout)}
			>
				<FaUserCircle className="text-3xl ml-2 mr-6 -mt-1 pt-1" />
				{user?.name}
				<FaCaretDown className="text-2xl ml-6 mr-2" />
			</button>
			<div>
				<ProfileMenu />
			</div>
		</div>
	);
};

export default LogoutContainer;
