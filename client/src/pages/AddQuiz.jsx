import QuizForm from '../components/quizComponents/QuizForm';

const AddQuiz = (_id) => {
	return (
		<section className="flex justify-center align-middle w-full bg-gradient-to-b from-white to-green-50 pt-28">
			<article className="flex flex-col justify-center w-full h-fit overflow-hidden">
				<div className="w-full bg-primary text-center mt-4 border-t-4 border-t-forth border-b-4 border-b-forth">
					<h1 className="my-2 text-3xl lg:text-5xl font-robotoCondensed font-bold text-forth">
						Add Quiz
					</h1>
				</div>
				<QuizForm />
			</article>
		</section>
	);
};

export default AddQuiz;
