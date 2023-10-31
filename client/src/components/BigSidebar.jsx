import NavLinks from './NavLinks';
import { useDashboardContext } from '../pages/DashboardLayout';

const BigSidebar = () => {
	const { showSidebar } = useDashboardContext();
	return (
		<section className="invisible xl:visible absolute w-1/6 4xl:w-1/12 h-screen bg-blue-200 pt-16 px-2">
			<NavLinks />
		</section>
	);
};

export default BigSidebar;
