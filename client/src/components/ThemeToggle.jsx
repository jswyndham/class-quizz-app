import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { useDashboardContext } from '../pages/DashboardLayout';

const ThemeToggle = () => {
	const { isDarkTheme, toggleDarkTheme } = useDashboardContext();

	return (
		<div onClick={toggleDarkTheme}>
			{isDarkTheme ? (
				<div className="flex flex-row w-fit hover:cursor-pointer">
					<BsFillSunFill className="ml-10 mt-1 text-xl text-orange-400" />
					<p className="mx-2 text-xl text-blue-900 dark:text-blue-300">
						light theme
					</p>
				</div>
			) : (
				<div className="flex flex-row w-fit hover:cursor-pointer">
					<BsFillMoonFill className="ml-10 mt-1 text-xl text-yellow-400" />
					<p className="mx-2 text-xl text-blue-900 dark:text-blue-300">
						dark theme
					</p>
				</div>
			)}
		</div>
	);
};

export default ThemeToggle;
