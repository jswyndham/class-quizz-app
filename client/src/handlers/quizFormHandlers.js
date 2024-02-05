import { useNavigate } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createQuiz } from '../../features/quiz/quizAPI';
import { uploadCloudinaryFile } from '../../features/cloudinary/cloudinaryAPI';

const quizFormHandlers = () => {
	// STATE HOOKS
	const {
		quiz,
		selectedClassId,
		quizBackgroundColor,
		setQuizTitle,
		updateQuestion,
		addNewQuestion,
		setCorrectAnswer,
		addOptionToQuestion,
		updateOption,
		deleteOption,
	} = QuizHooks({});

	const navigate = useNavigate();

	// ADD QUIZ TITLE
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
			class: selectedClassId ? [selectedClassId] : [],
		};

		try {
			const createdQuizResponse = await dispatch(
				createQuiz(formData)
			).unwrap();
			dispatch(fetchClasses());
			if (createdQuizResponse && createdQuizResponse.classId) {
				dispatch(fetchClassById(createdQuizResponse.classId));
			}

			navigate('/dashboard');
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

	return {
		handleQuizTitleChange,
		handleQuizDuration,
		updateQuestionText,
		updateQuestionPoints,
		handleRadioChange,
		handleFileChange,
		handleAddNewQuestion,
		handleAddOption,
		handleOptionTextChange,
		handleDeleteOption,
		handleSubmit,
	};
};

export default quizFormHandlers;
