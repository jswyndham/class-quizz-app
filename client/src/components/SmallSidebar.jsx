import { useDashboardContext } from '../pages/DashboardLayout';

const SmallSidebar = () => {
	const data = useDashboardContext();
	console.log(data);
	return <div>SmallSidebar</div>;
};

export default SmallSidebar;
