import { useLoaderData, useNavigate } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import QuizForm from '../components/QuizForm';
import { useDispatch } from 'react-redux';
import QuizHooks from '../hooks/QuizHooks';
import { updateQuiz } from '../features/quiz/quizAPI';

export const loader = async ({ params }) => {
	try {
		const { data } = await customFetch.get(`/quiz/${params.id}`);
		return data;
	} catch (error) {
		toast.error(error?.response?.data?.msg);
		return redirect('/dashboard');
	}
};

const EditQuiz = () => {
	const { quizForm } = useLoaderData();

	// STATE HOOKS
	const {
		quiz,
		selectedFile,
		setUploadedImageUrl,
		setQuizTitle,
		updateQuestion,
		addNewQuestion,
		addOptionToQuestion,
		updateAnswerType,
		updateOption,
		deleteOption,
	} = QuizHooks({ quizForm });

	const navigate = useNavigate();
	const dispatch = useDispatch();

	// SUBMIT
	const handleSubmit = async (e) => {
		e.preventDefault();

		const quizData = { quizTitle, questions: [] };

		try {
			dispatch(updateQuiz({ id: quizForm._id, quizData }));
			navigate('/dashboard');
			toast.success('Class successfully updated');
		} catch (error) {
			console.error('Failed to update class:', error);
			toast.error('Failed to update class');
		}
	};

	return (
		<section className="flex justify-center align-middle w-screen bg-white mt-24 pt-4 ">
			<article className="flex flex-col justify-center w-screen h-fit overflow-hidden">
				<div className="w-full bg-blue-400  text-center">
					<h1 className="m-6 text-3xl font-bold text-white">
						Edit Quiz
					</h1>
				</div>
				<QuizForm />
			</article>
		</section>
	);
};

export default EditQuiz;
