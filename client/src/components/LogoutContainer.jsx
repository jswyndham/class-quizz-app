import { logoutUser } from '../features/authenticate/authAPI';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const LogoutContainer = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Handle user logout
	const handleLogout = async (e) => {
		e.preventDefault();

		try {
			await dispatch(logoutUser());
			toast.success('Logging out...');
			navigate('/');
		} catch (error) {
			toast.error(error || 'Login failed');
		}
	};

	return (
		<div className="flex justify-end">
			<button
				type="button"
				onClick={handleLogout}
				className="w-24 h-9 m-2 bg-forth text-white rounded-lg hover:text-primary drop-shadow-md  hover:shadow-gray-600 hover:shadow-md hover:border-2 hover:border-secondary active:shadow-md active:bg-white active:text-blue-800 active:border-solid active:border-2 active:border-blue-800"
			>
				logout
			</button>
		</div>
	);
};

export default LogoutContainer;
