import { useEffect } from 'react';
import { FormRowSelect, QuizFormAnswer, QuizFormQuestion } from '.';
import QuizHooks from '../hooks/QuizHooks';
import { useNavigate, useNavigation, Form } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { createQuiz } from '../features/quiz/quizAPI';
import { uploadCloudinaryFile } from '../features/cloudinary/cloudinaryAPI';
import { MdDeleteForever } from 'react-icons/md';
import { FaRegImage } from 'react-icons/fa6';
import { fetchClasses } from '../features/classGroup/classAPI';

const QuizForm = () => {
	// STATE HOOKS
	const {
		quiz,
		selectedClassId,
		setSelectedClassId,
		setQuizTitle,
		updateQuestion,
		addNewQuestion,
		setCorrectAnswer,
		addOptionToQuestion,
		updateAnswerType,
		updateOption,
		deleteOption,
		deleteQuizForm,
	} = QuizHooks({});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const navigation = useNavigation();
	const isSubmitting = navigation.state === 'submitting';

	// Accessing classes from Redux store for dropdown menu selection
	const classData = useSelector((state) => state.class.class);

	// Dispatch the action to fetch all classes for dropdown menu
	useEffect(() => {
		dispatch(fetchClasses());
	}, []);

	// ADD QUIZ TITLE
	const handleQuizTitleChange = (e) => {
		setQuizTitle(e.target.value);
	};

	// ADD QUESTION TEXT
	const updateQuestionText = (questionIndex, newText, e) => {
		// Ensure newText is a string
		newText = String(newText);

		const updatedQuestion = {
			...quiz.questions[questionIndex],

			questionText: newText,
		};

		updateQuestion(questionIndex, updatedQuestion);
	};

	// ADD QUESTION POINTS
	const updateQuestionPoints = (questionIndex, e) => {
		const points = parseInt(e.target.value, 10) || 0;
		const updatedQuestion = {
			...quiz.questions[questionIndex],
			points: points,
		};

		updateQuestion(questionIndex, updatedQuestion);
	};

	// HANDLE CHANGES TO THE RADIO BUTTON
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

	// SUBMIT CREATE QUIZ
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Add the selected class ID to the quiz data
		const formData = {
			...quiz,
			class: selectedClassId ? [selectedClassId] : [],
		};

		try {
			// Handle create quiz with dispatch
			await dispatch(createQuiz(formData));

			console.log('The formData: ', { formData });
			navigate('/dashboard/all-quizzes');
			toast.success('Quiz successfully added');

			// Clear local storage
			localStorage.removeItem('quizData');
			quiz.questions.forEach((_, index) => {
				localStorage.removeItem(`editorContent-${index}`);
			});
		} catch (error) {
			console.error('Failed to create quiz:', error);
			toast.error('Failed to create quiz');
		}
	};

	return (
		<div className="flex justify-center align-middle w-screen h-fit">
			<Form
				method="post"
				onSubmit={handleSubmit}
				className="flex flex-col justify-center items-center drop-shadow-lg w-full m-3 md:mx-5 my-4 lg:w-10/12 xl:w-max"
			>
				<div className="flex flex-col justify-center w-full md:mx-2 my-1">
					<label htmlFor="questionText" className="text-lg ml-4 my-4">
						Quiz Title
					</label>

					<div>
						<input
							type="text"
							name="quizTitle"
							value={quiz.quizTitle}
							onChange={handleQuizTitleChange}
							placeholder="Quiz Title"
							className="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						/>
					</div>

					<div>
						{classData && classData.length > 0 && (
							<div className="flex flex-col 2xl:flex-row md:mx-4 my-3">
								<FormRowSelect
									name="classId"
									labelText="Add a class"
									list={classData.map((cls) => ({
										key: cls._id,
										value: cls._id,
										label: cls.className,
									}))}
									value={selectedClassId} // The state variable to hold the selected class ID
									onChange={(e) =>
										setSelectedClassId(e.target.value)
									} // Function to update the state variable
								/>
							</div>
						)}
					</div>

					{quiz.questions.map((question, questionIndex) => (
						<div
							key={questionIndex}
							className="flex flex-col justify-center align-middle bg-slate-100 lg:border border-slate-400 lg:p-6 my-3"
						>
							<div className="my-3 mx-4">
								{/* Used the map index to number the questions */}
								<p className="underline underline-offset-2 italic">
									Question {questionIndex + 1}
								</p>
							</div>
							<div className="flex justify-between m-5">
								<div className="flex flex-col">
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

								<div
									onClick={() =>
										deleteQuizForm(questionIndex)
									}
									className="h-fit flex flex-row text-xl -mr-2 -mt-2 text-red-600 hover:cursor-pointer hover:text-red-800"
								>
									<p className="mx-1 -mt-2">remove</p>
									<MdDeleteForever />
								</div>
							</div>

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
							<button
								type="button"
								onClick={() => handleAddOption(questionIndex)}
							>
								Add Option
							</button>
						</div>
					))}
					<button
						type="button"
						onClick={handleAddNewQuestion}
						className="flex justify-center w-8/12 p-6 text-xl bg-secondary border border-slate-500 rounded-lg shadow-lg shadow-slate-300"
					>
						Add New Question
					</button>
				</div>
				{/* SUBMIT FORM */}
				<div className="flex justify-center w-8/12 mx-4 my-12">
					<button
						type="submit"
						className="w-1/3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						{isSubmitting ? 'submitting...' : 'create'}
					</button>
				</div>
			</Form>
		</div>
	);
};

export default QuizForm;
