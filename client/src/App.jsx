import './App.css';
import { Cloudinary } from '@cloudinary/url-gen';
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
	EditClass,
	EditQuiz,
	Error,
	Stats,
	DashboardLayout,
	ClassLayout,
	QuizLayout,
	AddQuiz,
	AllQuizzes,
} from './pages';

// Page loaders
import { loader as allClassesLoader } from './pages/AllClasses';
import { loader as editClassLoader } from './pages/EditClass';
import { loader as editQuizLoader } from './pages/EditQuiz';
import { loader as adminLoader } from './pages/Admin';
import { loader as quizLoader } from './pages/AllQuizzes';

// Page actions
import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { action as deleteClassAction } from './pages/DeleteClass';

// Default theme
export const checkDefaultTheme = () => {
	const isDarkTheme = localStorage.getItem('darkMode') === 'true';
	document.documentElement.classList.toggle('dark', isDarkTheme);

	return isDarkTheme;
};

checkDefaultTheme();

// Routes
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
				children: [
					{
						index: true,
						element: <AllClasses />,
						loader: allClassesLoader,
					},
					{
						path: `add-class`,
						element: <AddClass />,
					},
					{
						path: 'class/:id',
						element: <ClassLayout />,
					},
					{
						path: 'quiz/:id',
						element: <QuizLayout />,
					},
					{
						path: 'all-quizzes',
						element: <AllQuizzes />,
						loader: quizLoader,
					},
					{
						path: `edit-quiz/:id`,
						element: <EditQuiz />,
						loader: editQuizLoader,
					},
					{
						path: 'add-quiz',
						element: <AddQuiz />,
					},

					{
						path: `edit-class/:id`,
						element: <EditClass />,
						loader: editClassLoader,
					},
					{
						path: `delete-class/:id`,
						action: deleteClassAction,
					},
					{
						path: `stats`,
						element: <Stats />,
					},

					{
						path: `profile`,
						element: <Profile />,
					},
					{
						path: `admin`,
						element: <Admin />,
						loader: adminLoader,
					},
				],
			},
		],
	},
]);

function App() {
	const cld = new Cloudinary({ cloud: { cloudName: 'ducq9yzyn' } });

	return <RouterProvider router={router} />;
}

export default App;
