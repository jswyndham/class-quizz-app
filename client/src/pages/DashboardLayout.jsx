import { useEffect, useState, createContext, useContext, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SmallSidebar, Navbar } from '../components';
import { checkDefaultTheme } from '../App';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../features/users/userAPI';

const DashboardContext = createContext();

const DashboardLayout = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.class.currentUser);
	const [showSidebar, setShowSidebar] = useState(false);
	const [isDarkTheme, setisDarkTheme] = useState(checkDefaultTheme());
	const [showLogout, setShowLogout] = useState(false);

	useEffect(() => {
		const abortController = new AbortController();

		if (!user) {
			dispatch(fetchCurrentUser())
				.unwrap()
				.catch(() => {
					if (!abortController.signal.aborted) {
						navigate('/');
					}
				});
		}

		return () => {
			abortController.abort();
		};
	}, [dispatch, navigate, user]);

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

	const value = useMemo(
		() => ({
			user,
			showSidebar,
			isDarkTheme,
			showLogout,
			setShowLogout,
			setisDarkTheme,
			toggleDarkTheme,
			toggleSidebar,
			logoutUser,
		}),
		[
			user,
			showSidebar,
			isDarkTheme,
			showLogout,
			logoutUser,
			toggleDarkTheme,
			toggleSidebar,
		]
	);

	return (
		<DashboardContext.Provider value={value}>
			<section>
				<article className="flex flex-row">
					<div className="relative flex">
						<Navbar />
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
