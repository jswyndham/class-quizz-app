import { React, createContext, useContext, useState } from 'react';
import { Outlet, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { SmallSidebar, Navbar } from '../components';
import { checkDefaultTheme } from '../App';
import customFetch from '../utils/customFetch.js';

export const loader = async () => {
	try {
		const { data } = await customFetch.get('/users/current-user');
		return data;
	} catch (error) {
		return redirect('/');
	}
};

const DashboardContext = createContext();

const DashboardLayout = ({ isDarkThemeEnabled }) => {
	const { user } = useLoaderData();
	const navigate = useNavigate();
	const [showSidebar, setShowSidebar] = useState(false);
	const [isDarkTheme, setisDarkTheme] = useState(checkDefaultTheme());
	const [showLogout, setShowLogout] = useState(false);

	// TOGGLE DARK THEME
	const toggleDarkTheme = () => {
		const newDarkTheme = !isDarkTheme;
		setisDarkTheme(newDarkTheme);
		document.body.classList.toggle('dark', newDarkTheme);
		localStorage.setItem('theme', newDarkTheme ? 'dark' : 'light');
	};

	// TOGGLE MENU
	const toggleSidebar = () => {
		setShowSidebar(!showSidebar);
	};

	// LOGOUT
	const logoutUser = async () => {
		navigate('/');
		await customFetch.get('/auth/logout');
		toast.success('Logging out...');
	};

	return (
		<DashboardContext.Provider
			value={{
				user,
				showSidebar,
				isDarkTheme,
				showLogout,
				setShowLogout,
				setisDarkTheme,
				toggleDarkTheme,
				toggleSidebar,
				logoutUser,
			}}
		>
			<section>
				<article className="flex flex-row">
					<div className="flex">
						<div>
							<Navbar />
						</div>
						<div>
							<SmallSidebar />
							<Outlet context={{ user }} />
						</div>
					</div>
				</article>
			</section>
		</DashboardContext.Provider>
	);
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
