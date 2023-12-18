import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizById } from '../features/quiz/quizAPI';
import { useParams } from 'react-router-dom';
import { QuizLayoutQuestion, QuizLayoutAnswer } from '../components';
import { QUESTION_TYPE } from '../../../server/utils/constants';

const QuizLayout = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const currentQuiz = useSelector((state) => state.quiz.currentQuiz);
	const { loading, error } = useSelector((state) => state.class);

	useEffect(
		() => {
			dispatch(fetchQuizById(id));
		},
		[dispatch, id],
		id
	);

	if (!currentQuiz) {
		return <div>Loading quiz...</div>; // or any other placeholder content
	}
	if (loading) return <div>Loading class...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<section className="w-screen h-fit flex flex-col justify-center align-middle">
			<div className="mt-36 mb-6">
				<h2 className="text-4xl font-serif text-blue-800 text-center">
					{currentQuiz.quizTitle}
				</h2>
			</div>
			<article className="flex justify-center">
				<div className="flex flex-col justify-center items-center w-full h-full sm:mx-2 md:mx-5 lg:w-10/12 2xl:w-8/12 md:p-1 lg:p-2 2xl:px-8 lg:m-6 border border-slate-300 rounded-md drop-shadow-xl shadow-lg shadow-slate-400">
					{currentQuiz.questions.map((question) => (
						<div
							key={question._id}
							className="w-full lg:w-10/12 2xl:w-8/12 m-4 border border-slate-400 rounded-sm"
						>
							<QuizLayoutQuestion
								points={question.points}
								question={question.questionText}
							/>

							<ol className="p-6 text-xl">
								{question.answerType ===
								QUESTION_TYPE.MULTIPLE_CHOICE
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
											QUESTION_TYPE.LONG_ANSWER && (
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
