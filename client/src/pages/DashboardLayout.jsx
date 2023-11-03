import { React, createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router';
import { BigSidebar, SmallSidebar, Navbar } from '../components';
import { checkDefaultTheme } from '../App';

const DashboardContext = createContext();

const DashboardLayout = ({ isDarkThemeEnabled }) => {
	// temp
	const user = { name: 'James' };

	const [showSidebar, setShowSidebar] = useState(false);
	const [isDarkTheme, setisDarkTheme] = useState(checkDefaultTheme());
	const [showLogout, setShowLogout] = useState(false);

	const toggleDarkTheme = () => {
		const newDarkTheme = !isDarkTheme;
		setisDarkTheme(newDarkTheme);
		document.body.classList.toggle('dark', newDarkTheme);
		localStorage.setItem('theme', newDarkTheme ? 'dark' : 'light');
	};

	const toggleSidebar = () => {
		setShowSidebar(!showSidebar);
	};

	const logoutUser = async () => {
		console.log('logout user');
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
					<BigSidebar />
					<div className="flex">
						<div>
							<Navbar />
						</div>
						<div>
							<SmallSidebar />
							<Outlet />
						</div>
					</div>
				</article>
			</section>
		</DashboardContext.Provider>
	);
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
