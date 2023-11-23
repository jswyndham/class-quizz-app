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
		<section className="relative flex justify-center h-screen w-screen py-36 px-4">
			<div className="2xl:w-7/12 w-full mx-2 md:mx-12 grid grid-cols-1 gap-6">
				{classGroups.map((classList) => {
					return <ClassCard key={classList._id} {...classList} />;
				})}
			</div>
		</section>
	);
};

export default ClassContainer;
