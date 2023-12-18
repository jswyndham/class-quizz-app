import { useSelector } from 'react-redux';
import QuizForm from '../components/QuizForm';

const AddQuiz = () => {
	const { loading, error } = useSelector((state) => state.class);

	// HANDLE LOADING AND ERROR
	if (loading) return <div>Loading class...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<section className="flex justify-center align-middle w-screen bg-white mt-24 pt-4 ">
			<article className="flex flex-col justify-center w-screen h-fit overflow-hidden">
				<div className="w-full bg-primary text-center mt-4 border-t-4 border-t-forth border-b-4 border-b-forth">
					<h1 className="my-2 text-3xl font-bold text-forth">
						Add Quiz
					</h1>
				</div>
				<QuizForm />
			</article>
		</section>
	);
};

export default AddQuiz;
