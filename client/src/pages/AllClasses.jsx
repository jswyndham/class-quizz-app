import { ClassContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch.js';
import { useLoaderData } from 'react-router';
import { useContext, createContext } from 'react';
import { toast } from 'react-toastify';

export const loader = async ({ request }) => {
	try {
		const { data } = await customFetch.get('/class');
		return { data };
	} catch (error) {
		console.log(error);
		toast.error(error?.response?.data?.msg);
		return error;
	}
};

const AllClassesContext = createContext();

const AllClasses = () => {
	const { data } = useLoaderData();

	return (
		<AllClassesContext.Provider value={{ data }}>
			<ClassContainer />
		</AllClassesContext.Provider>
	);
};

export const useAllClassesContext = () => useContext(AllClassesContext);

export default AllClasses;
