import QuizForm from '../components/quizComponents/QuizForm';

const AddQuiz = (_id) => {
	return (
		<section className="flex justify-center align-middle w-full bg-gradient-to-br from-white via-slate-200 to-secondary pt-18">
			<article className="w-full 4xl:w-8/12 h-fit overflow-hidden">
				<div className="relative h-36 mt-24 lg:mt-36 2xl:ml-36">
					<div className="mt-24 w-24 h-24 m-5 pl-6 bg-forth rounded-xl drop-shadow-2xl"></div>
					<div className="absolute top-0 left-12 w-40 h-72 m-5 pl-6 bg-primary rounded-md shadow-xl shadow-slate-500">
						<h1 className="text-third text-4xl md:text-5xl font-thin tracking-tighter">
							add
						</h1>
						<h1 className="text-forth font-roboto font-bold text-7xl tracking-widest">
							QUIZ
						</h1>
					</div>
				</div>
				<QuizForm />
			</article>
		</section>
	);
};

export default AddQuiz;
