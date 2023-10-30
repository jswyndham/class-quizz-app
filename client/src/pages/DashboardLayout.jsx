import { React, createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router';
import { BigSidebar, SmallSidebar, Navbar } from '../components';

const DashboardContext = createContext();

const DashboardLayout = () => {
	// temp
	const user = { name: 'James' };

	const [showSidebar, setShowSidebar] = useState(false);
	const [isDarkTheme, setisDarkTheme] = useState(false);

	const toggleDarkTheme = () => {
		console.log('toggle dark theme');
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
				toggleDarkTheme,
				toggleSidebar,
				logoutUser,
			}}
		>
			<main>
				<div className="flex flex-row">
					<BigSidebar />
					<div className="flex flex-col">
						<div>
							<Navbar />
						</div>
						<div>
							<SmallSidebar />
							<Outlet />
						</div>
					</div>
				</div>
			</main>
		</DashboardContext.Provider>
	);
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
