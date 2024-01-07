import { ClassContainer } from '../components/classComponents';
import { useLoaderData } from 'react-router';
import { useContext, createContext, useMemo } from 'react';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const loader = async () => {
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

	const contextValue = useMemo(() => ({ data }), [data]);

	return (
		<AllClassesContext.Provider value={contextValue}>
			<ClassContainer />
		</AllClassesContext.Provider>
	);
};

export const useAllClassesContext = () => useContext(AllClassesContext);

export default AllClasses;
