import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
	HomeLayout,
	Landing,
	Register,
	Login,
	Profile,
	Admin,
	AddClass,
	AllClasses,
	DeleteTest,
	EditTest,
	Error,
	Stats,
	DashboardLayout,
	ClassLayout,
} from './pages';

// PAGE ACTIONS
import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { action as addClassAction } from './pages/AddClass';
import { loader as DashboardLoader } from './pages/DashboardLayout';
import { loader as AllClassesLoader } from './pages/AllClasses';

// DEFAULT THEME
export const checkDefaultTheme = () => {
	const isDarkTheme = localStorage.getItem('darkMode') === 'true';
	document.documentElement.classList.toggle('dark', isDarkTheme);

	return isDarkTheme;
};

checkDefaultTheme();

// ROUTES
const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout />,
		errorElement: <Error />,
		children: [
			{
				index: true,
				element: <Landing />,
			},
			{
				path: `class`,
				element: <ClassLayout />,
			},

			{
				path: `add-class`,
				element: <AddClass />,
				action: addClassAction,
			},
			{
				path: `edit-test`,
				element: <EditTest />,
			},
			{
				path: `delete-test`,
				element: <DeleteTest />,
			},
			{
				path: `login`,
				element: <Login />,
				action: loginAction,
			},

			{
				path: 'register',
				element: <Register />,
				action: registerAction,
			},

			{
				path: `dashboard`,
				element: <DashboardLayout />,
				loader: DashboardLoader,
				children: [
					{
						index: true,
						element: <AddClass />,
						action: addClassAction,
					},
					{
						path: `stats`,
						element: <Stats />,
					},
					{
						path: 'all-classes',
						element: <AllClasses />,
						loader: AllClassesLoader,
					},
					{
						path: `profile`,
						element: <Profile />,
					},
					{
						path: `admin`,
						element: <Admin />,
					},
				],
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
