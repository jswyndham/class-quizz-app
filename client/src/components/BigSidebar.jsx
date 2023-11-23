import NavLinks from './NavLinks';
import { useDashboardContext } from '../pages/DashboardLayout';
import ThemeToggle from './ThemeToggle';

const BigSidebar = () => {
	//const { showSidebar } = useDashboardContext();
	return (
		<section className="invisible xl:visible w-48 h-full bg-primary dark:bg-gray-800 pt-8 top-24">
			<ThemeToggle />
			<NavLinks />
		</section>
	);
};

export default BigSidebar;
