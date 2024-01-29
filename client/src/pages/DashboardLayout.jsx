import {
	useEffect,
	createContext,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SmallSidebar, Navbar } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../features/user/userAPI';
import DashboardLayoutHooks from '../hooks/DashboardLayoutHooks';
import ClassListMenu from '../components/classComponents/ClassListMenu';

const DashboardContext = createContext();

const DashboardLayout = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.currentUser);

	const [showSidebar, setShowSidebar] = useState(false);

	const sidebarRef = useRef();

	const { isDarkTheme, setisDarkTheme, showLogout, setShowLogout } =
		DashboardLayoutHooks({});

	// If the user data is not available, redirect to the home page.
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

	const toggleSidebar = () => {
		setShowSidebar(!showSidebar);
	};

	// Detect click outside the sidebar and close
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
				setShowSidebar(false);
			}
		};

		// Attach the listener
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			// Remove the listener on cleanup
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showSidebar]);

	// TOGGLE DARK THEME
	const toggleDarkTheme = () => {
		const newDarkTheme = !isDarkTheme;
		setisDarkTheme(newDarkTheme);
		document.body.classList.toggle('dark', newDarkTheme);
		localStorage.setItem('theme', newDarkTheme ? 'dark' : 'light');
	};

	// Handle user logout
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
		[user, showSidebar, isDarkTheme, showLogout]
	);

	return (
		<DashboardContext.Provider value={value}>
			<section className="flex flex-row min-h-screen">
				<div>
					<ClassListMenu />
					<SmallSidebar
						showSidebar={showSidebar}
						toggleSidebar={toggleSidebar}
						sidebarRef={sidebarRef}
					/>
				</div>
				<div className="flex flex-col flex-grow">
					<Navbar toggleSidebar={toggleSidebar} />

					<main className="flex-grow md:pl-64">
						<Outlet context={{ user }} />
					</main>
				</div>
			</section>
		</DashboardContext.Provider>
	);
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
