import NavLinks from './NavLinks';
import { useDashboardContext } from '../pages/DashboardLayout';
import ThemeToggle from './ThemeToggle';

const BigSidebar = () => {
	//const { showSidebar } = useDashboardContext();
	return (
		<section className="absolute invisible xl:visible w-72 h-screen bg-primary dark:bg-gray-800 pt-8 top-24">
			<ThemeToggle />
			<NavLinks />
		</section>
	);
};

export default BigSidebar;
