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
				path: `alltests`,
				element: <AllTests />,
			},
			{
				path: `addtest`,
				element: <AddTest />,
			},
			{
				path: `edittest`,
				element: <EditTest />,
			},
			{
				path: `deletetest`,
				element: <DeleteTest />,
			},
			{
				path: `login`,
				element: <Login />,
			},
			{
				path: `profile`,
				element: <Profile />,
			},
			{
				path: `register`,
				element: <Register />,
			},
			{
				path: `stats`,
				element: <Stats />,
			},
			{
				path: `admin`,
				element: <Admin />,
			},
			{
				path: `dashboard`,
				element: <DashboardLayout />,
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
