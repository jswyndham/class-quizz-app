import './App.css';
import ClassGroup from './components/ClassGroup';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
	HomeLayout,
	Landing,
	Register,
	Login,
	Profile,
	Admin,
	AddTest,
	AllTests,
	DeleteTest,
	EditTest,
	Error,
	Stats,
	DashboardLayout,
	ClassLayout,
} from './pages';

export const checkDefaultTheme = () => {
	const isDarkTheme = localStorage.getItem('darkMode') === 'true';
	document.documentElement.classList.toggle('dark', isDarkTheme);

	return isDarkTheme;
};

checkDefaultTheme();

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
				path: `add-test`,
				element: <AddTest />,
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
			},

			{
				path: `register`,
				element: <Register />,
			},

			{
				path: `dashboard`,
				element: <DashboardLayout />,
				children: [
					{
						index: true,
						element: <AddTest />,
					},
					{
						path: `stats`,
						element: <Stats />,
					},
					{
						path: `all-tests`,
						element: <AllTests />,
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

	// (
	// 	<main className="flex flex-row">
	// 		<section>
	// 			<h1 className="text-4xl font-bold text-red-600">
	// 				Class Display
	// 			</h1>
	// 		</section>
	// 		<section>
	// 			<ClassGroup />
	// 		</section>
	// 	</main>
	// );
}

export default App;
