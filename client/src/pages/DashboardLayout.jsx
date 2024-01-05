import { useEffect, createContext, useContext, useMemo, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SmallSidebar, Navbar } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../features/user/userAPI';
import DashboardLayoutHooks from '../hooks/DashboardLayoutHooks';

const DashboardContext = createContext();

const DashboardLayout = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.currentUser);

	const menuRef = useRef();

	const {
		showSidebar,
		setShowSidebar,
		isDarkTheme,
		setisDarkTheme,
		showLogout,
		setShowLogout,
	} = DashboardLayoutHooks({});

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

	// Detect click outside the sidebar and close
	useEffect(() => {
		const checkOutsideMenu = (e) => {
			if (
				showSidebar &&
				menuRef.current &&
				!menuRef.current.contains(e.target)
			) {
				setShowSidebar(false);
			}
		};

		document.addEventListener('click', checkOutsideMenu);
		return () => {
			document.removeEventListener('click', checkOutsideMenu);
		};
	}, [showSidebar, setShowSidebar]);

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

	console.log('Context value: ', value);
	console.log('Current user: ', user);

	return (
		<DashboardContext.Provider value={value}>
			<section>
				<article className="flex flex-row">
					<div className="relative flex">
						<Navbar />
						<div>
							<SmallSidebar ref={menuRef} />
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
