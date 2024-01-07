import { FaUserCircle } from 'react-icons/fa';
import { useDashboardContext } from '../pages/DashboardLayout';

const LogoutContainer = () => {
	const { user, logoutUser } = useDashboardContext();

	return (
		<div className="flex justify-end">
			<button
				type="button"
				onClick={logoutUser}
				className="w-24 h-9 m-2 bg-forth text-white rounded-lg hover:text-primary drop-shadow-md  hover:shadow-gray-600 hover:shadow-md hover:border-2 hover:border-secondary active:shadow-md active:bg-white active:text-blue-800 active:border-solid active:border-2 active:border-blue-800"
			>
				logout
			</button>
		</div>
	);
};

export default LogoutContainer;
