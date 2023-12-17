import { useState, useEffect } from 'react';
import { QUESTION_TYPE } from '../../../server/utils/constants';

const QuizHooks = (initialQuizData) => {
	const [quiz, setQuiz] = useState(() => {
		const savedQuiz = localStorage.getItem('quizData');
		return savedQuiz
			? JSON.parse(savedQuiz)
			: {
					quizTitle: initialQuizData.quizTitle || '',
					questions: initialQuizData.questions || [
						{
							questionText: '',
							answerType: '',
							options: [],
							points: '',
						},
					],
					class: initialQuizData.class || [],
			  };
	});

	const [selectedFile, setSelectedFile] = useState(null);

	const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

	useEffect(() => {
		console.log('Quiz state updated:', quiz);
		localStorage.setItem('quizData', JSON.stringify(quiz));
	}, [quiz]);

	const setQuizTitle = (quizTitle) => {
		setQuiz((prevQuiz) => ({ ...prevQuiz, quizTitle }));
	};

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

	const updateQuestion = (index, updatedQuestion) => {
		setQuiz((prevQuiz) => {
			const updatedQuestions = prevQuiz.questions.map((q, i) =>
				i === index ? updatedQuestion : q
			);
			return { ...prevQuiz, questions: updatedQuestions };
		});
		console.log('QUIZ: ', quiz);
	};

	// ON CHANGE HANDLER
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

	const addNewQuestion = () => {
		setQuiz((prevQuiz) => ({
			...prevQuiz,
			questions: [
				...prevQuiz.questions,
				{ questionText: '', answerType: '', options: [] },
			],
		}));
	};

	const addOptionToQuestion = (questionIndex) => {
		updateQuestion(questionIndex, {
			...quiz.questions[questionIndex],
			options: [
				...quiz.questions[questionIndex].options,
				{ optionText: '', isCorrect: false },
			],
		});
	};

	const deleteOption = (questionIndex, optionIndex) => {
		const updatedOptions = quiz.questions[questionIndex].options.filter(
			(_, idx) => idx !== optionIndex
		);
		updateQuestion(questionIndex, {
			...quiz.questions[questionIndex],
			options: updatedOptions,
		});
	};

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
		setUploadedImageUrl,
		setSelectedFile,
		setQuizTitle,
		updateAnswerType,
		updateQuestion,
		updateOption,
		addNewQuestion,
		addOptionToQuestion,
		deleteOption,
		deleteQuizForm,
	};
};

export default QuizHooks;
