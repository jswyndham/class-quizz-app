// ******** Toast modals ***********
import { toast } from 'react-toastify';

//  *********** Image Uploads **************
import { uploadCloudinaryFile } from '../features/cloudinary/cloudinaryAPI';

//  ************ React Router **************
import {
	useLoaderData,
	useNavigate,
	useNavigation,
	redirect,
	Form,
} from 'react-router-dom';

//  *********** React Hooks ************
import QuizHooks from '../hooks/QuizHooks';
import { useEffect } from 'react';

//  ******** Redux Files *****************
import { useDispatch, useSelector } from 'react-redux';
import { updateQuiz } from '../features/quiz/quizAPI';
import { fetchClasses } from '../features/classGroup/classAPI';
import { selectClassDataArray } from '../features/classGroup/classSelectors';

// ******** React Components ************
import {
	QuizFormColorSelection,
	QuizFormAnswer,
	QuizFormQuestion,
	QuizFormDescription,
} from '../components/quizComponents';
import { FormRowSelect } from '../components';

// ******** React Date Picker ************
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// ********** Utilities ***************
import { QUESTION_TYPE } from '../../../server/utils/constants';
import customFetch from '../utils/customFetch';

// ******** React Icons ************
import { MdDeleteForever } from 'react-icons/md';
import { FaRegImage } from 'react-icons/fa6';
import { RxQuestionMarkCircled } from 'react-icons/rx';
import { CiCirclePlus } from 'react-icons/ci';
import { FaArrowCircleRight } from 'react-icons/fa';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { FaPlusCircle } from 'react-icons/fa';

//  ********* Loader **************
export const loader = async ({ params }) => {
	try {
		const { data } = await customFetch.get(`/quiz/${params.id}`);

		return data; // Return only the quiz object
	} catch (error) {
		toast.error(error?.response?.data?.msg);
		return redirect('/dashboard');
	}
};

const EditQuiz = () => {
	const quizData = useLoaderData();

	// ************** Imported quiz hooks ****************
	const {
		quiz,
		selectedClassId,
		currentStep,
		selectQuestion,
		setSelectedClassId,
		setQuiz,
		setQuizTitle,
		updateAnswerType,
		updateQuestion,
		updateOption,
		setCorrectAnswer,
		addNewQuestion,
		addOptionToQuestion,
		deleteOption,
		setStartDate,
		setEndDate,
		setCurrentStep,
	} = QuizHooks(quizData.quiz);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const isLoading = useSelector((state) => {
		state.quiz.loading;
	});

	// Accessing classes from Redux store for dropdown menu selection
	const classData = useSelector(selectClassDataArray);

	// Define how many steps you have to handle pagination
	const totalSteps = 2;

	// Dispatch the action to fetch all classes for dropdown menu
	// useEffect(() => {
	// 	dispatch(fetchClasses());
	// }, []);

	if (!quizData) {
		return (
			<div className="pt-36 text-3xl font-extrabold text-center">
				<p>Quiz cannot be found...</p>
			</div>
		);
	}

	//  ****************** HANDLERS ***********************

	// Handle quiz title
	const handleQuizTitleChange = (e) => {
		setQuizTitle(e.target.value);
	};

	// Add a new question to the quiz
	const handleAddNewQuestion = () => {
		addNewQuestion();
	};

	// Handle start and end dates for quiz
	const handleStartDateChange = (date) => {
		setStartDate(date);
	};

	const handleEndDateChange = (date) => {
		setEndDate(date);
	};

	// Handle quiz visibilty
	const handleIsVisible = (e) => {
		e.preventDefault();
		setIsVisible(!isVisible);
	};

	// ADD OPTION (ANSWER) TEXT
	const handleOptionTextChange = (questionIndex, optionIndex, e) => {
		const updatedOption = {
			...quiz.questions[questionIndex].options[optionIndex],
			optionText: e.target.value,
		};
		updateOption(questionIndex, optionIndex, updatedOption);
	};

	// ADD NEW OPTION (ANSWER) TO QUESTION
	const handleAddOption = (questionIndex) => {
		addOptionToQuestion(questionIndex);
	};

	// UPDATE QUESTION TEXT
	//This function replaces initial text value with the new text value in the tinyMCE editor. This must be done outside of the Editor component due to a bug in tinyMCE that causes conflict between the initialState and new values, which triggers new text to output in reverse.
	const updateQuestionText = (questionIndex, newText) => {
		setQuiz((prevQuiz) => {
			const updatedQuestions = prevQuiz.questions.map((question, idx) => {
				if (idx === questionIndex) {
					return { ...question, questionText: newText };
				}
				return question;
			});
			return { ...prevQuiz, questions: updatedQuestions };
		});
	};

	// Update the points in a question
	const updateQuestionPoints = (questionIndex, e) => {
		const points = parseInt(e.target.value, 10) || 0;
		const updatedQuestions = [...quiz.questions];
		updatedQuestions[questionIndex] = {
			...updatedQuestions[questionIndex],
			points,
		};
		setQuiz({ ...quiz, questions: updatedQuestions });
	};

	// HANDLE IMAGE UPLOAD FOR CLOUDINARY
	const handleFileChange = async (e, questionIndex) => {
		const file = e.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append('file', file);

			try {
				const uploadResult = await dispatch(
					uploadCloudinaryFile(formData)
				).unwrap();
				const updatedQuestion = {
					...quiz.questions[questionIndex],
					uploadedImageUrl: uploadResult.url,
				};
				updateQuestion(questionIndex, updatedQuestion);
			} catch (error) {
				console.error('Failed to upload file:', error);
				toast.error('Failed to upload file');
			}
		}
		console.log('FILE: ', file);
		console.log('Question Index: ', questionIndex);
	};

	// Delete a question option
	const handleDeleteOption = (questionIndex, optionIndex) => {
		deleteOption(questionIndex, optionIndex);
	};

	// Handle update submission
	const handleUpdateSubmit = async (e) => {
		e.preventDefault();

		// Extract the quiz ID from the loaded data
		const quizId = quizData.quiz._id;

		// Add the selected class ID to the quiz data
		const formData = {
			...quiz,
			class: selectedClassId,
		};

		if (!quizId) {
			console.error('Quiz ID is undefined');
			toast.error('Unable to update quiz. Quiz ID is missing.');
			return;
		}

		// Update state for edited quiz and fetch updated state for class groups
		try {
			await dispatch(updateQuiz({ _id: quizId, formData })).unwrap();
			navigate('/dashboard');
			dispatch(fetchClasses());
			toast.success('Quiz updated successfully');
		} catch (error) {
			toast.error(error.message || 'Failed to update quiz.');
		}
	};

	// ************ EDIT QUIZ FORM ****************
	return (
		<section className="flex justify-center items-center w-screen md:w-full bg-gradient-to-br from-white via-slate-200 to-secondary pt-18">
			<article className="mx-auto w-full lg:w-10/12 xl:w-2/3 2xl:w-1/2 h-fit">
				<div className="relative h-36 mt-24 lg:mt-36">
					<div className="mt-24 w-24 h-24 m-5 pl-6 bg-forth rounded-xl drop-shadow-2xl"></div>
					<div className="absolute top-0 left-12 w-40 h-72 m-5 pl-6 bg-primary rounded-md shadow-xl shadow-slate-500">
						<h1 className="text-third text-4xl md:text-5xl font-thin tracking-tighter">
							edit
						</h1>
						<h1 className="text-forth font-roboto font-bold text-7xl tracking-widest">
							QUIZ
						</h1>
					</div>
				</div>
				<Form
					method="post"
					onSubmit={handleUpdateSubmit}
					className="flex flex-col w-full bg-white md:max-w-4xl justify-center items-center drop-shadow-lg px-3 sm:px-3 lg:px-4 xl:px-6 my-4 shadow-md shadow-slate-400"
				>
					<article className="flex flex-col justify-center w-full my-1 ">
						{currentStep === 1 && (
							<>
								{/* ********** QUIZ TITLE *********** */}
								<div className="w-full bg-slate-200 my-4 rounded-lg p-1 border border-slate-400 drop-shadow-xl">
									<div className="flex flex-row justify-between">
										<label
											htmlFor="questionText"
											className="text-xl md:text-2xl text-forth font-quizgate mx-4 my-2 tracking-wide"
										>
											Quiz Title:
										</label>
										<div className="relative h-fit w-fit p-2 text-lg text-forth font-bold hover:cursor-help hover-trigger">
											<RxQuestionMarkCircled />
											<span className="absolute right-2 w-56 h-fit p-4 bg-white border rounded-md border-slate-300 shadow-md shadow-slate-400 text-sm text-third hover-target">
												The name of the quiz that will
												be shown to class group members.
											</span>
										</div>
									</div>

									{/* ********* Input for quiz title ******** */}
									<div>
										<input
											type="text"
											name="quizTitle"
											value={quiz.quizTitle}
											onChange={handleQuizTitleChange}
											placeholder="Enter Quiz Title"
											className="border border-gray-300 text-gray-900 text-md rounded-lg lg:text-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										/>
									</div>
								</div>

								{/* ******** Select background color ******* */}
								<div className="bg-slate-200 my-3 p-1 rounded-lg drop-shadow-xl border border-slate-400">
									<div className="flex flex-row justify-between">
										<label
											htmlFor="questionText"
											className="text-xl md:text-2xl text-forth font-quizgate mx-4 my-2 tracking-wide"
										>
											Choose a color for the quiz title:{' '}
										</label>
										<div className="relative h-fit w-fit p-2 text-lg text-forth font-bold hover:cursor-help hover-trigger">
											<RxQuestionMarkCircled />
											<span className="absolute right-2 w-56 h-fit p-4 bg-white border rounded-md border-slate-300 shadow-md shadow-slate-400 text-sm text-third hover-target">
												Choose the color that class
												group members will see.
											</span>
										</div>
									</div>

									<div className="w-full h-fit bg-white rounded-lg p-1">
										<QuizFormColorSelection
											selectedColor={quiz.backgroundColor}
											onSelectColor={(newColor) =>
												setQuiz((prevQuiz) => ({
													...prevQuiz,
													backgroundColor: newColor,
												}))
											}
										/>
									</div>
								</div>

								{/* ****** Select a class to add quiz ****** */}
								<div className="flex flex-col my-4 text-forth font-roboto text-xl bg-slate-100 rounded-lg p-2 border border-slate-400 drop-shadow-xl">
									<div className="flex flex-row justify-between">
										<label
											htmlFor="questionText"
											className="text-xl md:text-2xl text-forth font-quizgate mx-4 mt-2 tracking-wide"
										>
											Choose your group:
										</label>
										<div className="relative h-fit w-fit p-2 text-lg text-forth font-bold hover:cursor-help hover-trigger">
											<RxQuestionMarkCircled />
											<span className="absolute right-2 w-56 h-fit p-4 bg-white border rounded-md border-slate-300 shadow-md shadow-slate-400 text-sm text-third hover-target">
												Choose the class that you want
												to appoint the quiz.
											</span>
										</div>
									</div>
									{classData && classData.length > 0 && (
										<div>
											<FormRowSelect
												list={classData.map((cls) => ({
													key: cls._id,
													value: cls._id,
													label: cls.className,
												}))}
												value={quiz.classId} // The state holding the selected class ID
												onChange={(e) =>
													setSelectedClassId(
														e.target.value
													)
												} // Function to update the state variable
											/>
										</div>
									)}
								</div>

								{/* ********* Quiz access period ********* */}
								<div
									className="w-full my-6 p-2 bg-slate-100 rounded-lg border border-slate-400 drop-shadow-lg"
									style={{
										position: 'relative',
										zIndex: '10',
									}}
								>
									<div className="flex flex-row justify-between">
										<label
											className="text-xl md:text-2xl text-forth font-quizgate tracking-wide mx-2 my-2 "
											htmlFor="quizDuration"
										>
											Quiz access period:
										</label>
										<div className="relative h-fit w-fit p-2 text-lg text-forth font-bold hover:cursor-help hover-trigger">
											<RxQuestionMarkCircled />
											<span className="absolute z-50 right-2 w-56 h-40 p-4 bg-white border rounded-md border-slate-300 shadow-md shadow-slate-400 text-sm text-third hover-target">
												Choose a start date/time and an
												end date/time when class group
												members will be allowed access
												to the quiz.
											</span>
										</div>
									</div>

									<div className="flex flex-col lg:flex-row items-center py-3 xl:px-3">
										<div className="flex flex-row lg:flex-col 3xl:flex-row py-3 px-5">
											<label className="text-lg pr-3 pb-2 mt-0.5 font-roboto">
												Start Time:
											</label>
											<ReactDatePicker
												selected={quiz.startDate}
												onChange={handleStartDateChange}
												showTimeSelect
												timeFormat="HH:mm"
												timeIntervals={10}
												timeCaption="time"
												dateFormat="MMMM d, yyyy h:mm aa"
												className="z-40 px-2 py-1 rounded-md border border-slate-300"
											/>
										</div>
										<div className="flex flex-row lg:flex-col 3xl:flex-row py-3 px-5">
											<label className="text-lg pr-5 font-roboto">
												End Time:
											</label>
											<ReactDatePicker
												selected={quiz.endDate}
												onChange={handleEndDateChange}
												showTimeSelect
												timeFormat="HH:mm"
												timeIntervals={10}
												timeCaption="time"
												dateFormat="MMMM d, yyyy h:mm aa"
												className="px-2 py-1 rounded-md border border-slate-300"
											/>
										</div>
									</div>
								</div>

								{/* ************ isVisible switch *************** */}
								<div
									className="w-full my-6 p-4 bg-slate-100 rounded-lg border border-slate-400 drop-shadow-lg"
									style={{
										position: 'relative',
										zIndex: '0',
									}}
								>
									<label className="inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											className="sr-only peer"
											checked={quiz.isVisibleToStudent}
											onChange={() =>
												setQuiz((prev) => ({
													...prev,
													isVisibleToStudent:
														!prev.isVisibleToStudent,
												}))
											}
										/>
										<div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
										<span className="ms-5 text-xl md:text-2xl font-quizgate text-forth tracking-wider dark:text-gray-300">
											Quiz is visible to student users
										</span>
									</label>
								</div>

								{/* ****** Quiz duration (quiz timer) ****** */}
								<div
									className="w-full my-6 p-2 bg-slate-100 rounded-lg border border-slate-400 drop-shadow-lg"
									style={{
										position: 'relative',
										zIndex: '0',
									}}
								>
									<div className="flex flex-row justify-start">
										<label
											className="flex flex-col w-96 text-xl md:text-2xl text-forth font-quizgate m-2 px-2 tracking-wider"
											htmlFor="quizDuration"
										>
											<p>Quiz Duration</p>{' '}
											<p className="font-robotoCondensed">
												(in minutes):
											</p>
										</label>

										<div className="w-full flex justify-between m-auto">
											<input
												id="quizDuration"
												type="number"
												value={quiz.duration}
												onChange={(e) =>
													handleQuizDuration(
														e.target.value
													)
												}
												min="1"
												className="w-24 h-fit p-2 mx-4 border border-slate-400 rounded-md bg-white"
											/>
											<div className="relative h-fit w-fit -mt-2 pl-4 text-lg text-forth font-bold hover:cursor-help hover-trigger">
												<RxQuestionMarkCircled />
												<span className="absolute z-50 right-2 w-64 h-fit p-4 bg-white border rounded-md border-slate-300 shadow-md shadow-slate-400 text-sm text-third hover-target">
													You can choose a time limit
													for your quiz. Once that
													time limit is over, the quiz
													will close the quiz and
													submit the results.
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* ******* Quiz description section ******* */}
								<div className="z-0 w-full my-6 p-3 bg-slate-100 rounded-lg border border-slate-400 drop-shadow-lg">
									<div className="flex flex-row justify-between">
										<label
											className="text-xl md:text-2xl text-forth font-quizgate mx-4 my-2 tracking-wide"
											htmlFor="quizDuration"
										>
											Quiz Description:
										</label>
										<div className="relative h-fit w-fit pl-4 text-lg text-forth font-bold hover:cursor-help hover-trigger">
											<RxQuestionMarkCircled />
											<span className="absolute z-10 right-2 w-64 h-fit p-4 bg-white border rounded-md border-slate-300 shadow-md shadow-slate-400 text-sm text-third hover-target">
												Write a description for class
												group members to read. Let users
												know the purpose and objective
												of the quiz.
											</span>
										</div>
									</div>
									<QuizFormDescription
										descriptionValue={quiz.quizDescription}
										onChangeDescription={(
											newDescription
										) => {
											setQuiz((prevQuiz) => ({
												...prevQuiz,
												quizDescription: newDescription, // Update the quiz description in the state
											}));
										}}
									/>
								</div>
							</>
						)}

						{/* ******* Quiz question section ********** */}
						{currentStep === 2 && (
							<>
								{quiz.questions.map(
									(question, questionIndex) => (
										<div
											key={questionIndex}
											className="flex flex-col justify-center align-middle bg-slate-100 lg:border border-slate-400 lg:p-6 my-3"
											onClick={() =>
												selectQuestion(questionIndex)
											}
										>
											<div className="my-3 mx-4">
												{/* Used the map index to number the questions */}
												<p className="font-robotoCondensed text-3xl font-bold text-forth underline underline-offset-2">
													Question {questionIndex + 1}
												</p>
											</div>
											<div className="flex justify-between m-5">
												<div className="flex flex-col">
													{/* Input for question points */}
													<div className="flex justify-center items-center bg-zinc-100 p-2 my-4 rounded-md drop-shadow-xl">
														<label
															htmlFor="imageText"
															className="mr-4 text-lg"
														>
															Question Points
														</label>

														<input
															type="number"
															className="w-20 h-7 p-3 rounded-md"
															value={
																question.points ||
																0
															}
															onChange={(e) =>
																updateQuestionPoints(
																	questionIndex,
																	e
																)
															}
														/>
													</div>

													{/* ******** Input for image upload ********** */}
													<div className="flex flex-col justify-start bg-zinc-100 p-3 my-3 rounded-md drop-shadow-xl">
														<label
															htmlFor="imageText"
															className="mb-2 text-lg flex flex-row"
														>
															<FaRegImage />{' '}
															<p className="ml-2 -mt-1">
																Image Upload
															</p>
														</label>
														<input
															type="file"
															onChange={(e) =>
																handleFileChange(
																	e,
																	questionIndex
																)
															}
															className="your-custom-styles"
														/>
													</div>
												</div>

												{/* Button to remove the question from the form */}
												<div
													onClick={() =>
														deleteQuizForm(
															questionIndex
														)
													}
													className="h-fit flex flex-row text-xl sm:-mr-2 -ml-14 -mt-14 text-red-600 hover:cursor-pointer hover:text-red-800"
												>
													<p className="mx-1 -mt-2">
														remove
													</p>
													<MdDeleteForever />
												</div>
											</div>

											{/* The question section, which includes the 'Question Type' and the 'Question Text' rich text editor (tinyMCE) */}
											<div className="px-3">
												<QuizFormQuestion
													key={questionIndex}
													questionIndex={
														questionIndex
													}
													questionTextValue={
														question.questionText
													}
													questionTypeValue={
														question.answerType
													}
													uploadedImageUrl={
														question.uploadedImageUrl
													}
													questionTypeOnChange={(e) =>
														updateAnswerType(
															questionIndex,
															e.target.value
														)
													}
													onQuestionTextChange={
														updateQuestionText
													}
												/>
											</div>

											{/* ******** Multiple choice answer section ******** */}
											<div className="mx-2">
												{question.options.map(
													(option, optionIndex) => (
														<QuizFormAnswer
															key={optionIndex}
															optionTextValue={
																option.optionText
															}
															setCorrectAnswer={
																setCorrectAnswer
															}
															onRadioChange={() =>
																handleRadioChange(
																	questionIndex,
																	optionIndex
																)
															}
															checkedIsCorrect={
																option.isCorrect
															}
															onOptionTextChange={(
																newText
															) =>
																handleOptionTextChange(
																	questionIndex,
																	optionIndex,
																	newText
																)
															}
															onDelete={() =>
																handleDeleteOption(
																	questionIndex,
																	optionIndex
																)
															}
														/>
													)
												)}
											</div>

											{/* Button to add an extra answer option. Conditionally render the "Add Option" button */}
											{question.answerType ===
												QUESTION_TYPE.MULTIPLE_CHOICE
													.value && (
												<div
													className="relative flex flex-row justify-center items-center mx-3 my-5 lg:mt-6 lg:mb-4 h-14 w-56 hover:cursor-pointer"
													onClick={() =>
														handleAddOption(
															questionIndex
														)
													}
												>
													<div className="absolute left-4 flex text-center h-10 w-56 bg-forth text-primary rounded-r-full drop-shadow-xl shadow-md shadow-slate-400  hover:shadow-lg hover:shadow-slate-500 active:shadow-sm active:shadow-slate-600">
														<p className="my-1 pl-9 pr-6 pb-1 ml-1 font-quizgate text-2xl border-t border-r border-b border-primary rounded-r-full">
															Add answer option
														</p>
														<CiCirclePlus className="absolute -left-3 -top-1 text-5xl text-primary bg-forth rounded-full" />
													</div>
												</div>
											)}
										</div>
									)
								)}
							</>
						)}

						{/* ********* Button - add another question ************ */}
						<div className="flex justify-center my-4">
							{currentStep > 1 && (
								<button
									type="button"
									onClick={handleAddNewQuestion}
									className="flex flex-row justify-around items-center w-80 h-16 px-12 bg-gradient-to-br from-primary to-forth rounded-md text-white text-2xl font-robotoCondensed font-light border border-slate-500 hover:text-yellow-200 focus:ring-4 shadow-lg shadow-slate-400 drop-shadow-lg hover:shadow-500 transform active:scale-90 transition-transform"
								>
									<FaPlusCircle className="text-2xl" />
									<p>ADD QUESTION</p>
								</button>
							)}
						</div>

						{/* ************ Navigation Buttons ************** */}
						{currentStep < totalSteps && (
							<div className="flex justify-center">
								<button
									type="button"
									onClick={() =>
										setCurrentStep(currentStep + 1)
									}
									className="flex flex-row justify-around items-center m-4 w-80 h-16 px-4 py-2 bg-third rounded-md text-white text-lg font-roboto font-extrabold border-2 border-slate-500 focus:ring-4 shadow-lg transform active:scale-90 transition-transform"
								>
									<p className="text-2xl lg:text-3xl font-quizgate tracking-widest -mr-12">
										Next page
									</p>{' '}
									<FaArrowCircleRight className="text-2xl lg:text-3xl -ml-6" />
								</button>
							</div>
						)}

						<div className="flex flex-row justify-around my-4">
							{currentStep > 1 && (
								<button
									type="button"
									onClick={() =>
										setCurrentStep(currentStep - 1)
									}
									className="flex flex-row justify-around items-center my-4 lg:mx-4 w-44 lg:w-80 h-16 lg:px-4 py-2 bg-third rounded-md text-white text-lg font-roboto font-extrabold border-2 border-slate-500 focus:ring-4 shadow-lg transform active:scale-90 transition-transform"
								>
									<FaArrowCircleLeft className="text-xl lg:text-3xl" />
									<p className="text-xl lg:text-3xl font-quizgate font-thin tracking-widest -ml-3">
										Previous
									</p>
								</button>
							)}

							{/* ************ Submit Button ************* */}
							{currentStep > 1 && (
								<button
									type="submit"
									className="flex justify-center items-center w-44 mt-4 lg:w-80 h-16 lg:px-4 py-2 text-white bg-blue-700 border-2 border-slate-500 hover:bg-blue-800 hover:text-primary active:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								>
									{isLoading ? (
										<p className="text-xl lg:text-3xl font-quizgate font-thin tracking-widest -ml-3">
											UPDATING...
										</p>
									) : (
										<p className="text-xl lg:text-3xl font-roboto font-thin tracking-wide -ml-3 ">
											UPDATE
										</p>
									)}
								</button>
							)}
						</div>
					</article>
				</Form>
			</article>
		</section>
	);
};

export default EditQuiz;
