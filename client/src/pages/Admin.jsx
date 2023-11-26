import { FaSuitcaseRolling, FaCalendarCheck } from 'react-icons/fa';
import { useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const loader = async () => {
	try {
		const response = await customFetch.get('users/admin/app-stats');
		return response.data;
	} catch (error) {
		toast.error('You are not authorized to access this page.');
		return redirect('/dashboard');
	}
};

const Admin = () => {
	return (
		<section className="w-screen h-screen flex justify-center align-middle">
			<div className="mt-36">
				<h2 className="text-4xl font-serif text-blue-800">
					Admin Page
				</h2>
			</div>
		</section>
	);
};

export default Admin;
