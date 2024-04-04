import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizById } from '../features/quiz/quizAPI';
import { useParams } from 'react-router-dom';
import {
	QuizLayoutQuestion,
	QuizLayoutAnswer,
} from '../components/quizComponents';
import { QUESTION_TYPE } from '../../../server/utils/constants';

const QuizLayout = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const currentQuiz = useSelector((state) => state.quiz.currentQuiz);
	const error = useSelector((state) => state.quiz.error);
	const isLoading = useSelector((state) => state.quiz.loading);

	useEffect(() => {
		dispatch(fetchQuizById(id));
	}, []);

	if (isLoading) {
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-forth">
				<p>Loading...</p>
			</div>
		);
	}

	if (error)
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-red-700">
				<p>Error: {error}</p>
			</div>
		);

	if (!currentQuiz) {
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-forth">
				<p>No quiz available.</p>
			</div>
		);
	}

	return (
		<section className="w-full h-fit flex flex-col justify-center">
			<div className="mt-28 lg:mt-36 mb-6 mx-4 border-t-4 border-t-secondary border-b-4 border-b-secondary">
				<h2 className="text-3xl py-2 md:text-4xl font-serif font-semibold text-forth text-center">
					{currentQuiz.quizTitle}
				</h2>
			</div>
			<article className="flex justify-center">
				<div className="flex flex-col justify-center items-center w-full h-full sm:mx-2 md:mx-5 lg:w-10/12 2xl:w-8/12 md:p-1 lg:p-2 2xl:px-8 lg:m-6 border border-slate-300 rounded-md drop-shadow-xl shadow-lg shadow-slate-400">
					{currentQuiz.questions.map((question, questionIndex) => (
						<div
							key={questionIndex}
							className="w-full lg:w-10/12 2xl:w-8/12 m-4 border border-slate-400 rounded-sm"
						>
							<QuizLayoutQuestion
								questionNumber={questionIndex + 1}
								points={question.points}
								question={question.questionText}
							/>

							<ol className="px-6 pb-3 text-lg lg:text-xl font-roboto">
								{question.answerType ===
								QUESTION_TYPE.MULTIPLE_CHOICE.value
									? question.options.map((option, index) => (
											<QuizLayoutAnswer
												key={index}
												index={index}
												answerType={question.answerType}
												answers={option.optionText}
												correctAnswer={
													question.correctAnswer
												}
											/>
									  ))
									: question.answerType ===
											QUESTION_TYPE.LONG_ANSWER.value && (
											<QuizLayoutAnswer
												answerType={question.answerType}
											/>
									  )}
							</ol>
						</div>
					))}
				</div>
			</article>
		</section>
	);
};

export default QuizLayout;
