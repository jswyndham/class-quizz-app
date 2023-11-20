import { useAllClassesContext } from '../pages/AllClasses';
import ClassCard from './ClassCard';

const ClassContainer = () => {
	const { data } = useAllClassesContext();
	const { classGroups } = data;

	console.log(data);
	console.log(classGroups);

	if (classGroups.length === 0) {
		<h2 className="text-3xl font-bold">There are no classes to display</h2>;
	}
	return (
		<section className="relative grid grid-rows-3 grid-flow-col gap-4 h-screen w-screen px-4 xl:left-64 py-24">
			<div>
				{classGroups.map((classList) => {
					return <ClassCard key={classList._id} {...classList} />;
				})}
			</div>
		</section>
	);
};

export default ClassContainer;
