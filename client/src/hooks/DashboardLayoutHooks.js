import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkDefaultTheme } from '../App';

const DashboardLayoutHooks = () => {
	const navigate = useNavigate();
	const [showSidebar, setShowSidebar] = useState(false);
	const [isDarkTheme, setisDarkTheme] = useState(checkDefaultTheme());
	const [showLogout, setShowLogout] = useState(false);

	return {
		navigate,
		showSidebar,
		isDarkTheme,
		showLogout,
		setShowSidebar,
		setisDarkTheme,
		setShowLogout,
	};
};

export default DashboardLayoutHooks;
