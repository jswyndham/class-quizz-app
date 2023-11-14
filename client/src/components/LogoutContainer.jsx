import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useDashboardContext } from '../pages/DashboardLayout';

const LogoutContainer = () => {
	const { user, logoutUser } = useDashboardContext();

	return (
		<article className="flex flex-col justify-end -mt-4">
			<div className="flex flex-row justify-evenly pt-2 -mt-2 h-10 w-fit rounded-lg text-blue-800 dark:text-blue-300">
				<FaUserCircle className="text-4xl ml-2 mr-4 -mt-1 pt-1 " />
				{user?.firstName}
				<FaCaretDown className="text-2xl ml-6 mr-2 " />
			</div>
			<div className="flex justify-end">
				<button
					type="button"
					onClick={logoutUser}
					className="w-24 h-9 m-2 bg-blue-800 text-white rounded-lg drop-shadow-md shadow-md shadow-gray-400 hover:shadow-gray-500 hover:shadow-lg active:shadow-md active:bg-white active:text-blue-800 active:border-solid active:border-2 active:border-blue-800"
				>
					logout
				</button>
			</div>
		</article>
	);
};

export default LogoutContainer;
