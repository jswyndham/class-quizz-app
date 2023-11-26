import { useLoaderData } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const loader = async ({ params }) => {
	try {
		const { data } = await customFetch.get(`/class/${params.id}`);
		console.log('Fetched data:', data);
		return data;
	} catch (error) {
		console.error('Error fetching class data:', error);
		toast.error(error?.response?.data?.msg);
		return error;
	}
};

const ClassLayout = () => {
	const { classGroup } = useLoaderData();

	return (
		<section className="w-screen h-screen flex justify-center align-middle">
			<div className="mt-36">
				<h2 className="text-4xl font-serif text-blue-800">
					{classGroup.className}
				</h2>
			</div>
		</section>
	);
};

export default ClassLayout;
