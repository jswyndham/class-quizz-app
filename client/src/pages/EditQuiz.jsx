import {
	useLoaderData,
	useNavigate,
	useNavigation,
	redirect,
	Form,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useDispatch, useSelector } from 'react-redux';
import QuizHooks from '../hooks/QuizHooks';
import { updateQuiz } from '../features/quiz/quizAPI';
import { MdDeleteForever } from 'react-icons/md';
import { FormRowSelect } from '../components';
import { QuizFormAnswer, QuizFormQuestion } from '../components/quizComponents';
import { uploadCloudinaryFile } from '../features/cloudinary/cloudinaryAPI';
import { fetchClasses } from '../features/classGroup/classAPI';
import { useEffect } from 'react';
import { QUESTION_TYPE } from '../../../server/utils/constants';
import { CiCirclePlus } from 'react-icons/ci';

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

	// Imported quiz hooks
	const {
		quiz,
		selectedClassId,
		setSelectedClassId,
		setQuiz,
		updateOption,
		setQuizTitle,
		updateQuestion,
		addNewQuestion,
		updateAnswerType,
		deleteOption,
		deleteQuizForm,
		addOptionToQuestion,
	} = QuizHooks(quizData.quiz);

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

	if (!quizData) {
		return (
			<div className="pt-36 text-3xl font-extrabold text-center">
				<p>Loading...</p>
			</div>
		);
	}

	// HANDLE TITLE
	const handleQuizTitleChange = (e) => {
		setQuizTitle(e.target.value);
	};

	// ADD NEW QUESTION
	const handleAddNewQuestion = () => {
		addNewQuestion();
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

	// UPDATE QUESTION POINTS
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

	// DELETE OPTION
	const handleDeleteOption = (questionIndex, optionIndex) => {
		deleteOption(questionIndex, optionIndex);
	};

	// SUBMIT UPDATE
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

		try {
			dispatch(updateQuiz({ _id: quizId, formData })).unwrap();
			navigate('/dashboard');
			toast.success('Quiz updated successfully');
		} catch (error) {
			console.error('Failed to update class:', error);
			toast.error('Failed to update class');
		}
	};

	return (
		<div className="flex justify-center align-middle w-screen h-fit">
			<Form
				method="post"
				onSubmit={handleUpdateSubmit}
				className="flex flex-col justify-center items-center drop-shadow-lg w-full pt-36 m-3 md:mx-5 my-4 lg:w-10/12 xl:w-max"
			>
				<div className="flex flex-col justify-center w-full md:mx-2 my-1">
					<label htmlFor="questionText" className="text-lg ml-4 my-4">
						Quiz Title
					</label>

					{/* Quiz title */}
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

					{/* Select class drop menu */}
					<div>
						{quiz.class.length > 0 ? (
							<div className="hidden">
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
						) : (
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
							className="flex flex-col justify-center align-middle bg-slate-100 lg:border border-slate-400 lg:p-6 my-4"
						>
							<div className="flex justify-between m-5">
								<div className="flex flex-col">
									{/* POINTS INPUT */}
									<label
										htmlFor="imageText"
										className="mb-2 text-lg"
									>
										Question Points
									</label>

									<input
										type="number"
										className="w-20 h-7 p-2 rounded-md mb-6"
										value={
											quiz.questions[questionIndex].points
										} // Directly refer to the points of the question
										onChange={(e) =>
											updateQuestionPoints(
												questionIndex,
												e
											)
										}
									/>

									{/* IMAGE UPLOAD */}
									<label
										htmlFor="imageText"
										className="mb-2 text-lg"
									>
										Image Upload
									</label>
									<input
										type="file"
										onChange={(e) =>
											handleFileChange(e, questionIndex)
										}
										className="your-custom-styles"
									/>
								</div>

								{/* REMOVE BUTTON */}
								<div
									onClick={() =>
										deleteQuizForm(questionIndex)
									}
									className="h-fit flex flex-row text-xl -mr-2 -mt-4 text-red-600 hover:cursor-pointer hover:text-red-800"
								>
									<p className="mx-1 -mt-2">remove</p>
									<MdDeleteForever />
								</div>
							</div>

							<QuizFormQuestion
								questionTypeOnChange={(e) =>
									updateAnswerType(
										questionIndex,
										e.target.value
									)
								}
								questionTypeValue={question.answerType}
								onQuestionTextChange={updateQuestionText}
								questionTextValue={question.questionText}
								questionIndex={questionIndex}
							/>

							{question.options.map((option, optionIndex) => (
								<QuizFormAnswer
									key={optionIndex}
									optionTextValue={option.optionText}
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
						{isSubmitting ? 'submitting...' : 'update'}
					</button>
				</div>
			</Form>
		</div>
	);
};

export default EditQuiz;
