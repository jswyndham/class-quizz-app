import { useState, useEffect } from 'react';
import { QUESTION_TYPE } from '../../../server/utils/constants';

const QuizHooks = (initialQuizData) => {
	const [quiz, setQuiz] = useState(() => {
		return {
			quizTitle: initialQuizData.quizTitle || '',
			questions: initialQuizData.questions || [],
			class: initialQuizData.class || [],
		};
	});

	console.log('initialQuizData: ', initialQuizData);

	const [selectedFile, setSelectedFile] = useState(null);

	const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

	useEffect(() => {
		console.log('Quiz state updated:', quiz);
		localStorage.setItem('quizData', JSON.stringify(quiz));
	}, [quiz]);

	// QUIZ TITLE
	const setQuizTitle = (quizTitle) => {
		setQuiz((prevQuiz) => ({ ...prevQuiz, quizTitle }));
	};

	// UPDATE ANSWER TYPE
	const updateAnswerType = (index, answerType) => {
		setQuiz((prevQuiz) => {
			const newQuestions = [...prevQuiz.questions];
			newQuestions[index] = {
				...newQuestions[index],
				answerType: answerType,
				options:
					answerType === QUESTION_TYPE.MULTIPLE_CHOICE
						? Array(4).fill({ optionText: '', isCorrect: false })
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

	return {
		quiz,
		selectedFile,
		uploadedImageUrl,
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
	};
};

export default QuizHooks;
