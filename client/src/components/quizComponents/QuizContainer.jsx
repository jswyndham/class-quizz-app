// *************** React ********************
import { useEffect, memo } from 'react';
import { useNavigate } from 'react-router';

// ************* React Components *************
import QuizCard from './QuizCard';
import QuizAttemptCard from './QuizAttemptCard';
import QuizCardGradientValues from './QuizCardGradientValues';

// ****************** Redux ******************
import { useSelector, useDispatch } from 'react-redux';
import { selectClassDataArray } from '../../features/classGroup/classSelectors';
import { selectMembershipDataArray } from '../../features/membership/membershipSelectors';
import { fetchClasses } from '../../features/classGroup/classAPI';
import { fetchMemberships } from '../../features/membership/membershipAPI';
import { selectQuizDataArray } from '../../features/quiz/quizSelectors';
import { selectQuizAttemptDataArray } from '../../features/quizAttempt/quizAttemptSelector';

const MemoizedQuizCard = memo(QuizCard);
const MemoizedQuizAttemptCard = memo(QuizAttemptCard);
const QuizContainer = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const quizData = useSelector(selectQuizDataArray);
	const classData = useSelector(selectClassDataArray);
	const membershipData = useSelector(selectMembershipDataArray); // Get membership data
	const isLoading = useSelector(
		(state) => state.class.loading || state.membership.loading
	); // Adjust for loading state
	const error = useSelector(
		(state) => state.class.error || state.membership.error
	); // Adjust for error state
	const currentUser = useSelector((state) => state.user.currentUser);
	const userRole = currentUser?.userStatus;

	useEffect(() => {
		if (currentUser) {
			if (userRole === 'TEACHER' || userRole === 'ADMIN') {
				dispatch(fetchClasses());
			} else if (userRole === 'STUDENT') {
				dispatch(fetchMemberships());
			}
		}
	}, [currentUser, dispatch, userRole]);

	console.log('Membership Data (students): ', membershipData);
	console.log('Class Data (teachers): ', classData);
	console.log('user Data: ', currentUser);

	const { determineGradientClass } = QuizCardGradientValues({});

	function truncateString(str, maxLength) {
		return str.length > maxLength
			? str.substring(0, maxLength - 3) + '...'
			: str;
	}

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

	if (error) {
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-red-700">
				<p>Error: {error}</p>
			</div>
		);
	}

	if (
		userRole === 'TEACHER' ||
		(userRole === 'ADMIN' && classData.length === 0)
	) {
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-forth">
				<p>No quizzes available.</p>
			</div>
		);
	}

	if (userRole === 'STUDENT' && membershipData.length === 0) {
		return (
			<div className="text-4xl font-quizgate mt-48 text-center text-forth">
				<p>No quizzes available.</p>
			</div>
		);
	}

	return (
		<section className="flex justify-center h-full w-full pt-24 md:pt-36 pb-8 overflow-hidden">
			<section className="w-full flex flex-col justify-start">
				{userRole === 'TEACHER' || userRole === 'ADMIN'
					? classData.map((classes) => {
							// Class name with trunate function
							const classNameOriginal = `${classes.className}`;
							const classNameTrunicate = truncateString(
								classNameOriginal,
								27
							);
							return (
								<article key={classes._id} className="my-4">
									<div
										onClick={() =>
											handleClassLink(classes._id)
										}
										className="w-full h-fit bg-forth text-primary p-2 border-b-4 border-primary shadow-lg shadow-slate-400 hover:cursor-pointer"
									>
										<h2 className="hidden lg:flex text-2xl font-roboto font-bold italic">
											{classes.className}
										</h2>
										<h2 className="flex lg:hidden text-2xl font-roboto font-bold italic">
											{classNameTrunicate}
										</h2>
									</div>

									<article className="p-3 flex justify-center">
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
									</article>
								</article>
							);
					  })
					: userRole === 'STUDENT'
					? membershipData.map((classGroupItem) => {
							// Make sure mapped array is not undefined or empty

							if (
								!classGroupItem.quizAttempts ||
								classGroupItem.quizAttempts.length === 0
							) {
								return console.log('NO CLASS LIST ITEM...');
							}

							// Access className
							const classNameOriginal = classGroupItem?.className;
							if (!classNameOriginal) {
								return console.log('No class name found.');
							}

							// Class name with trunate function
							const classNameTrunicate = truncateString(
								classNameOriginal,
								27
							);
							console.log('classGroupItem:', classGroupItem);
							return (
								<article
									key={classGroupItem._id}
									className="my-4"
								>
									<div
										onClick={() =>
											handleClassLink(classGroupItem._id)
										}
										className="w-full h-fit bg-forth text-primary p-2 border-b-4 border-primary shadow-lg shadow-slate-400 hover:cursor-pointer"
									>
										<h2 className="hidden lg:flex text-2xl font-roboto font-bold italic">
											{classNameOriginal}
										</h2>
										<h2 className="flex lg:hidden text-2xl font-roboto font-bold italic">
											{classNameTrunicate}
										</h2>
									</div>

									{/* Quiz Attempts */}
									<div className="p-3 flex justify-center">
										<div
											className={
												classGroupItem.quizAttempts
													.length === 1
													? 'lg:w-10/12 w-full h-fit px-1 md:mx-2 grid grid-cols-1'
													: 'lg:w-10/12 w-full h-fit md:mx-2 grid grid-cols-1 2xl:grid-cols-2 gap-6'
											}
										>
											{classGroupItem.quizAttempts.map(
												(quizAttempt) => {
													console.log(
														'Quiz Attempt Data:',
														quizAttempt
													);

													// Calculate total points
													const totalPoints =
														quizAttempt.quiz &&
														quizAttempt.quiz
															.questions
															? quizAttempt.quiz.questions.reduce(
																	(
																		acc,
																		question
																	) =>
																		acc +
																		(question.points ||
																			0),
																	0
															  )
															: 0;

													return (
														<MemoizedQuizAttemptCard
															key={
																quizAttempt._id
															}
															quizAttemptId={
																quizAttempt._id
															}
															quizId={
																quizAttempt.quiz
																	._id
															}
															questionCount={
																quizAttempt.quiz
																	.questions
																	.length
															}
															totalPoints={
																totalPoints
															}
															{...quizAttempt.quiz}
															gradientClass={determineGradientClass(
																quizAttempt.quiz
																	.backgroundColor
															)}
														/>
													);
												}
											)}
										</div>
									</div>
								</article>
							);
					  })
					: null}
			</section>
		</section>
	);
};

export default QuizContainer;
