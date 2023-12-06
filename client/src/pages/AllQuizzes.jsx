import { QuizContainer } from '../components';
import { useLoaderData } from 'react-router';
import { useContext, createContext, useMemo } from 'react';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const loader = async () => {
	try {
		const { data } = await customFetch.get('/quiz');
		return { data };
	} catch (error) {
		console.log(error);
		toast.error(error?.response?.data?.msg);
		return error;
	}
};

const AllQuizzesContext = createContext();

const AllQuizzes = () => {
	const { data } = useLoaderData();

	const contextValue = useMemo(() => ({ data }), [data]);

	return (
		<AllQuizzesContext.Provider value={contextValue}>
			<QuizContainer />
		</AllQuizzesContext.Provider>
	);
};

export const useAllQuizzesContext = () => useContext(AllQuizzesContext);

export default AllQuizzes;
