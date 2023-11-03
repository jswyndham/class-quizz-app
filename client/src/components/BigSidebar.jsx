import NavLinks from './NavLinks';
import { useDashboardContext } from '../pages/DashboardLayout';
import ThemeToggle from './ThemeToggle';

const BigSidebar = () => {
	const { showSidebar } = useDashboardContext();
	return (
		<section className="invisible xl:visible absolute w-1/6 4xl:w-1/12 h-screen bg-blue-200 dark:bg-gray-800 pt-16 px-2">
			<ThemeToggle />
			<NavLinks />
		</section>
	);
};

export default BigSidebar;
