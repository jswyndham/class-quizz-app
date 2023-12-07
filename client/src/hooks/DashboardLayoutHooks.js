import { useState, useDispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const DashboardLayoutHooks = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.class.currentUser);
	const [showSidebar, setShowSidebar] = useState(false);
	const [isDarkTheme, setisDarkTheme] = useState(checkDefaultTheme());
	const [showLogout, setShowLogout] = useState(false);

	return {
		navigate,
		dispatch,
		user,
		showSidebar,
		isDarkTheme,
		showLogout,
		setShowSidebar,
		setisDarkTheme,
		setShowLogout,
	};
};

export default DashboardLayoutHooks;
