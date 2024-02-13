import { useEffect, memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import QuizCard from './QuizCard';
import { fetchQuizzes } from '../../features/quiz/quizAPI';
import QuizCardGradientValues from './QuizCardGradientValues';
import { useNavigate } from 'react-router';
import { selectClassDataArray } from '../../features/classGroup/classSelectors';
import { selectQuizDataArray } from '../../features/quiz/quizSelectors';

const MemoizedQuizCard = memo(QuizCard);

const QuizContainer = () => {
	const navigate = useNavigate();

	const userData = useSelector((state) => state.user.currentUser);
	const quizData = useSelector(selectQuizDataArray);
	const classData = useSelector(selectClassDataArray);
	const isLoading = useSelector((state) => state.class.loading);
	const { error } = useSelector((state) => state.class);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchQuizzes());
	}, [dispatch]);

	// Defines the color value and returns the gradient in the css
	const { determineGradientClass } = QuizCardGradientValues({});

	// function to truncate string (cut short with periods)
	function truncateString(str, maxLength) {
		if (str.length > maxLength) {
			return str.substring(0, maxLength - 3) + '...';
		}
		return str;
	}

	// Handlers
	const handleClassLink = (_id) => {
		navigate(`/dashboard/class/${_id}`);
	};

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

	if (!classData) {
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-forth">
				<p>No quiz available.</p>
			</div>
		);
	}

	return (
		<section className="flex justify-center h-full w-full pt-36 pb-8 overflow-hidden">
			<div className="w-full flex flex-col justify-start">
				{classData.map((classes) => {
					// Class name with trunate function
					const classNameOriginal = `${classes.className}`;
					const classNameTrunicate = truncateString(
						classNameOriginal,
						27
					);
					return (
						<div key={classes._id} className="my-4">
							<div
								onClick={() => handleClassLink(classes._id)}
								className="w-full h-fit bg-forth text-primary p-2 border-b-4 border-primary shadow-lg shadow-slate-400 hover:cursor-pointer"
							>
								<h2 className="hidden lg:flex text-2xl font-roboto font-bold italic">
									{classes.className}
								</h2>
								<h2 className="flex lg:hidden text-2xl font-roboto font-bold italic">
									{classNameTrunicate}
								</h2>
							</div>

							<div className="p-3 flex justify-center">
								<div
									className={
										quizData.length === 1
											? 'lg:w-10/12 w-full h-fit px-1 md:mx-2 grid grid-cols-1'
											: 'lg:w-10/12 w-full h-fit md:mx-2 grid grid-cols-1 2xl:grid-cols-2 gap-6'
									}
								>
									{classes.quizzes?.map((quiz) => (
										<MemoizedQuizCard
											key={quiz._id}
											{...quiz}
											gradientClass={determineGradientClass(
												quiz.backgroundColor
											)}
										/>
									))}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default QuizContainer;
