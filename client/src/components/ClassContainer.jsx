import { useAllClassesContext } from '../pages/AllClasses';
import ClassInfo from './ClassInfo';

const ClassContainer = () => {
	let { data } = useAllClassesContext();

	console.log(data);

	if (data.length === 0) {
		<h2 className="text-3xl font-bold">There are no classes to display</h2>;
	}
	return (
		<section className="relative grid grid-rows-3 grid-flow-col gap-4 h-screen w-screen px-4 xl:left-64 py-24">
			<div className="max-w-lg min-w-md h-80 my-12 md:m-12 shadow-lg shadow-gray-400 px-6 py-8">
				{data.map((classList) => {
					return <ClassInfo key={classList._id} {...classList} />;
				})}
			</div>
		</section>
	);
};

export default ClassContainer;
