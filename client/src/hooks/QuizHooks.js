import { useState, useEffect } from 'react';
import { QUESTION_TYPE } from '../../../server/utils/constants';

const QuizHooks = (initialQuizData) => {
	const [quiz, setQuiz] = useState({
		quizTitle: initialQuizData.quizTitle || '',
		backgroundColor: initialQuizData.backgroundColor || '#2D9596',
		classId: initialQuizData.class?._id || '',
		startDate: initialQuizData.startDate
			? new Date(initialQuizData.startDate)
			: new Date(),
		endDate: initialQuizData.endDate
			? new Date(initialQuizData.endDate)
			: new Date(),
		duration: initialQuizData.duration || '',
		isVisibleToStudent: initialQuizData.isVisibleToStudent || false,
		quizDescription: initialQuizData.quizDescription || '',
		questions: initialQuizData.questions || [
			{
				questionText: '',
				answerType: '',
				options: [],
			},
		],
		class: initialQuizData.class || [],
	});

	// Hooks state for pictures and video upload
	const [selectedFile, setSelectedFile] = useState(null);

	const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

	// Handle the class ID to select a class in the dropdown menu
	const setSelectedClassId = (classId) => {
		setQuiz((prevQuiz) => ({ ...prevQuiz, classId }));
	};

	useEffect(() => {
		console.log(quiz); // Log the updated state
	}, [quiz]);

	// State to control the selected question index when a QuizFormAnswer is interacted with in a Form.
	const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

	// Store quiz data in local storage with using quizForm
	useEffect(() => {
		localStorage.setItem('quizData', JSON.stringify(quiz));
	}, [quiz]);

	// Set quiz title
	const setQuizTitle = (quizTitle) => {
		setQuiz((prevQuiz) => ({ ...prevQuiz, quizTitle }));
	};

	// This function provides the answer options when 'multiple choice' is selected in the question component of a Form
	const updateAnswerType = (index, answerType) => {
		setQuiz((prevQuiz) => {
			const newQuestions = [...prevQuiz.questions];
			newQuestions[index] = {
				...newQuestions[index],
				answerType: answerType,
				options:
					answerType === QUESTION_TYPE.MULTIPLE_CHOICE.value
						? Array(3).fill({ optionText: '', isCorrect: false })
						: [],
			};
			return { ...prevQuiz, questions: newQuestions };
		});
	};

	// UPDATE QUESTION PARAMETER
	const updateQuestion = (questionIndex, updatedQuestion) => {
		setQuiz((prev) => {
			const updatedQuestions = [...prev.questions];
			updatedQuestions[questionIndex] = updatedQuestion;
			return { ...prev, questions: updatedQuestions };
		});
	};

	// Function to set the selected question index (connected to the answer option "add answer option" button in Form)
	const selectQuestion = (index) => {
		setSelectedQuestionIndex(index);
	};

	// UPDATE ANSWER OPTIONS
	const updateOption = (questionIndex, optionIndex, updatedOption) => {
		setQuiz((prevQuiz) => {
			const updatedQuestions = prevQuiz.questions.map(
				(question, qIdx) => {
					if (qIdx === questionIndex) {
						const updatedOptions = question.options.map(
							(option, oIdx) =>
								oIdx === optionIndex ? updatedOption : option
						);
						return { ...question, options: updatedOptions };
					}
					return question;
				}
			);
			return { ...prevQuiz, questions: updatedQuestions };
		});
	};

	// SET CORRECT ANSWER
	const setCorrectAnswer = (questionIndex, optionIndex) => {
		setQuiz((prevQuiz) => {
			const newQuestions = prevQuiz.questions.map((question, qIdx) => {
				if (qIdx === questionIndex) {
					const newOptions = question.options.map((option, oIdx) => ({
						...option,
						isCorrect: oIdx === optionIndex,
					}));
					return { ...question, options: newOptions };
				}
				return question;
			});
			return { ...prevQuiz, questions: newQuestions };
		});
	};

	// ADD A NEW QUESTION IN THE QUIZ FORM
	const addNewQuestion = () => {
		const newQuestion = {
			questionText: '',
			answerType: '',
			options: [],
			points: 0,
		};
		setQuiz((prev) => ({
			...prev,
			questions: [...prev.questions, newQuestion],
		}));
	};

	// ADD AN ANSWER COMPONENT TO THE QUESTION
	const addOptionToQuestion = (questionIndex) => {
		updateQuestion(questionIndex, {
			...quiz.questions[questionIndex],
			options: [
				...quiz.questions[questionIndex].options,
				{ optionText: '', isCorrect: false },
			],
		});
	};

	// DELETE QUIZ ANSWER OPTIONS
	const deleteOption = (questionIndex, optionIndex) => {
		const updatedOptions = quiz.questions[questionIndex].options.filter(
			(_, idx) => idx !== optionIndex
		);
		updateQuestion(questionIndex, {
			...quiz.questions[questionIndex],
			options: updatedOptions,
		});
	};

	// DELETE THE QUESTION AND ANSWER QUIZ FORM COMPONENT
	const deleteQuizForm = (questionIndex) => {
		setQuiz((prevQuiz) => ({
			...prevQuiz,
			questions: prevQuiz.questions.filter(
				(_, idx) => idx !== questionIndex
			),
		}));
	};

	// State to set the quiz start date and end date
	const [dateRange, setDateRange] = useState([
		{
			startDate: new Date(),
			endDate: null,
			key: 'selection',
		},
	]);

	// Handle the 'Quiz Access Period' state
	const setStartDate = (date) => {
		setQuiz((prevQuiz) => ({ ...prevQuiz, startDate: date }));
	};
	const setEndDate = (date) => {
		setQuiz((prevQuiz) => ({ ...prevQuiz, endDate: date }));
	};

	// State to handle steps between form pages
	const [currentStep, setCurrentStep] = useState(1);

	return {
		quiz,
		selectedFile,
		uploadedImageUrl,
		selectedQuestionIndex,
		dateRange,
		currentStep,
		selectQuestion,
		setSelectedClassId,
		setQuiz,
		setUploadedImageUrl,
		setSelectedFile,
		setQuizTitle,
		updateAnswerType,
		updateQuestion,
		updateOption,
		setCorrectAnswer,
		addNewQuestion,
		addOptionToQuestion,
		deleteOption,
		deleteQuizForm,
		setDateRange,
		setStartDate,
		setEndDate,
		setCurrentStep,
	};
};

export default QuizHooks;
