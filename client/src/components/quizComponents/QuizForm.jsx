import { useEffect, useMemo } from 'react';
import { FormRowSelect } from '../';
import QuizHooks from '../../hooks/QuizHooks';
import { Form, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdDeleteForever } from 'react-icons/md';
import { FaRegImage } from 'react-icons/fa6';
import { fetchClasses } from '../../features/classGroup/classAPI';
import { CiCirclePlus } from 'react-icons/ci';
import {
	QuizFormColorSelection,
	QuizFormAnswer,
	QuizFormQuestion,
} from '../quizComponents';
import { QUESTION_TYPE } from '../../../../server/utils/constants';
import { selectClassDataArray } from '../../features/classGroup/classSelectors';
import { createQuiz } from '../../features/quiz/quizAPI';
import { toast } from 'react-toastify';

const QuizForm = () => {
	// STATE HOOKS
	const {
		quiz,
		selectedClassId,
		quizBackgroundColor,
		selectQuestion,
		setQuizBackgroundColor,
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
	} = QuizHooks({});

	const quizError = useSelector((state) => state.quiz.error);

	const dispatch = useDispatch();

	const navigate = useNavigate();

	console.log('Selected Class ID:', selectedClassId);

	// Accessing classes for dropdown menu selection
	const classData = useSelector(selectClassDataArray);

	// Dispatch the action to fetch all classes for dropdown menu
	useEffect(() => {
		dispatch(fetchClasses());
	}, [dispatch]);

	// *************** HANDLERS *********************

	// Add quiz title
	const handleQuizTitleChange = (e) => {
		setQuizTitle(e.target.value);
	};

	// Handle quiz duration (timer)
	const handleQuizDuration = (duration) => {
		setQuiz((prevQuiz) => ({
			...prevQuiz,
			quizDuration: Number(duration),
		}));
	};

	// Add text to question
	const updateQuestionText = (questionIndex, newText, e) => {
		// Ensure newText is a string
		newText = String(newText);

		const updatedQuestion = {
			...quiz.questions[questionIndex],

			questionText: newText,
		};

		updateQuestion(questionIndex, updatedQuestion);
	};

	// Add points to question
	const updateQuestionPoints = (questionIndex, e) => {
		const points = parseInt(e.target.value, 10) || 0;
		const updatedQuestion = {
			...quiz.questions[questionIndex],
			points: points,
		};

		updateQuestion(questionIndex, updatedQuestion);
	};

	// Handles the changes to the radio button which triggers changes to the 'isCorrect' boolean parameter in the Quiz schema
	const handleRadioChange = (questionIndex, optionIndex) => {
		setCorrectAnswer(questionIndex, optionIndex);
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
	};

	// ADD NEW QUESTION
	const handleAddNewQuestion = () => {
		addNewQuestion();
	};

	// ADD NEW OPTION (ANSWER) TO QUESTION
	const handleAddOption = (questionIndex) => {
		addOptionToQuestion(questionIndex);
	};

	// ADD OPTION (ANSWER) TEXT
	const handleOptionTextChange = (questionIndex, optionIndex, e) => {
		const updatedOption = {
			...quiz.questions[questionIndex].options[optionIndex],
			optionText: e.target.value,
		};
		updateOption(questionIndex, optionIndex, updatedOption);
	};

	// DELETE OPTION
	const handleDeleteOption = (questionIndex, optionIndex) => {
		deleteOption(questionIndex, optionIndex);
	};

	// Handle quiz form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Add the selected class ID to the quiz data
		const formData = {
			...quiz,
			backgroundColor: quizBackgroundColor,
			classId: selectedClassId ? [selectedClassId] : [],
		};

		try {
			const createdQuizResponse = await dispatch(
				createQuiz(formData)
			).unwrap();
			dispatch(fetchClasses());
			if (createdQuizResponse && createdQuizResponse.classId) {
				dispatch(fetchClassById(createdQuizResponse.classId));
			}

			navigate(`/dashboard/class/${selectedClassId}`);
			toast.success('Quiz successfully added');

			// Clear local storage
			localStorage.removeItem('quizData');
			quiz.questions.forEach((_, index) => {
				localStorage.removeItem(`editorContent-${index}`);
			});
		} catch (error) {
			console.error('Failed to create quiz:', error);
			toast.error(
				// redux error state
				quizError || 'An error occurred while creating the quiz'
			);
		}
	};

	// ************ QUIZ FORM ****************
	return (
		<div className="flex justify-center items-center w-full h-fit">
			<Form
				method="post"
				onSubmit={handleSubmit}
				className="flex flex-col w-full bg-white lg:max-w-4xl justify-center items-center drop-shadow-lg my-4 px-6 shadow-md shadow-slate-400"
			>
				<div className="flex flex-col justify-center w-full my-1 ">
					<div className="bg-slate-200 my-4 rounded-lg p-1 border border-slate-400 drop-shadow-xl">
						<label
							htmlFor="questionText"
							className="text-2xl text-forth font-quizgate mx-4 my-2 tracking-wide"
						>
							Quiz Title:
						</label>

						{/* Input for quiz title */}
						<div>
							<input
								type="text"
								name="quizTitle"
								value={quiz.quizTitle}
								onChange={handleQuizTitleChange}
								placeholder="Enter Quiz Title"
								className="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
						</div>
					</div>

					{/* Select background color for quiz card display */}
					<div className="bg-slate-200 mx-1 my-3 p-1 rounded-lg drop-shadow-xl border border-slate-400">
						<p className="text-2xl text-forth font-quizgate mx-4 my-2 tracking-wide">
							Choose a color for the quiz title:{' '}
						</p>
						<div className="w-full h-fit bg-white rounded-lg p-1">
							<QuizFormColorSelection
								selectedColor={quizBackgroundColor}
								onSelectColor={setQuizBackgroundColor}
							/>
						</div>
					</div>

					{/* Select a class to add quiz */}
					<div>
						{classData && classData.length > 0 && (
							<div className="flex flex-col md:mx-4 my-4 text-forth font-roboto text-xl bg-slate-100 rounded-lg p-2 border border-slate-400 drop-shadow-xl">
								<FormRowSelect
									name="classId"
									labelText="Choose your group:"
									list={classData.map((cls) => ({
										key: cls._id,
										value: cls._id,
										label: cls.className,
									}))}
									value={selectedClassId} // The state holding the selected class ID
									onChange={(e) =>
										setSelectedClassId(e.target.value)
									} // Function to update the state variable
								/>
							</div>
						)}
					</div>

					{/* Quiz duration (quiz timer) */}
					<div className="w-fit m-6 p-2 bg-slate-100 rounded-lg border border-slate-400 drop-shadow-lg">
						<label
							className="text-xl text-forth font-roboto mx-4 my-2 tracking-wide"
							htmlFor="quizDuration"
						>
							Quiz Duration (in minutes):
						</label>
						<input
							id="quizDuration"
							type="number"
							value={quiz.quizDuration}
							onChange={(e) => handleQuizDuration(e.target.value)}
							min="1"
							className="w-24 p-2 border border-slate-400 rounded-md bg-white"
						/>
					</div>

					{/* Quiz question section */}
					{quiz.questions.map((question, questionIndex) => (
						<div
							key={questionIndex}
							className="flex flex-col justify-center align-middle bg-slate-100 lg:border border-slate-400 lg:p-6 my-3"
							onClick={() => selectQuestion(questionIndex)}
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
											value={question.points || 0}
											onChange={(e) =>
												updateQuestionPoints(
													questionIndex,
													e
												)
											}
										/>
									</div>

									{/* Input for image upload */}
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
										deleteQuizForm(questionIndex)
									}
									className="h-fit flex flex-row text-xl -mr-2 -mt-14 text-red-600 hover:cursor-pointer hover:text-red-800"
								>
									<p className="mx-1 -mt-2">remove</p>
									<MdDeleteForever />
								</div>
							</div>

							{/* The question section, which includes the 'Question Type' and the 'Question Text' rich text editor (tinyMCE) */}
							<div className="px-3">
								<QuizFormQuestion
									key={questionIndex}
									questionIndex={questionIndex}
									questionTextValue={question.questionText}
									questionTypeValue={question.answerType}
									uploadedImageUrl={question.uploadedImageUrl}
									questionTypeOnChange={(e) =>
										updateAnswerType(
											questionIndex,
											e.target.value
										)
									}
									onQuestionTextChange={updateQuestionText}
								/>
							</div>

							{/* Multiple choice answer section */}
							<div className="mx-2">
								{question.options.map((option, optionIndex) => (
									<QuizFormAnswer
										key={optionIndex}
										optionTextValue={option.optionText}
										setCorrectAnswer={setCorrectAnswer}
										onRadioChange={() =>
											handleRadioChange(
												questionIndex,
												optionIndex
											)
										}
										checkedIsCorrect={option.isCorrect}
										onOptionTextChange={(newText) =>
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
								))}
							</div>

							{/* Button to add an extra answer option. Conditionally render the "Add Option" button */}
							{question.answerType ===
								QUESTION_TYPE.MULTIPLE_CHOICE.value && (
								<div
									className="relative flex flex-row justify-center items-center mx-3 my-5 lg:mt-6 lg:mb-4 h-14 w-56 hover:cursor-pointer"
									onClick={() =>
										handleAddOption(questionIndex)
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
					))}

					<div className="flex justify-center my-4">
						{/* Button to add another question to the form */}
						<button
							type="button"
							onClick={handleAddNewQuestion}
							className="w-80 h-16 px-4 py-2 bg-third rounded-md text-white text-lg font-roboto font-extrabold border-1 border-slate-600 focus:ring-4 shadow-lg transform active:scale-90 transition-transform"
						>
							Add New Question
						</button>
					</div>
				</div>

				{/* Button to submit the form */}
				<div className="flex justify-center w-8/12 mx-4 my-12">
					<button
						type="submit"
						className="w-7/12 text-white bg-blue-700 hover:bg-blue-800 active:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						Create Quiz
					</button>
				</div>
			</Form>
		</div>
	);
};

export default QuizForm;
