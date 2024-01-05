import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkDefaultTheme } from '../App';

const DashboardLayoutHooks = () => {
	const navigate = useNavigate();
	const [isDarkTheme, setisDarkTheme] = useState(checkDefaultTheme());
	const [showLogout, setShowLogout] = useState(false);

	return {
		navigate,
		isDarkTheme,
		showLogout,
		setisDarkTheme,
		setShowLogout,
	};
};

export default DashboardLayoutHooks;
