import { Form } from 'react-router-dom';
import { FormRow, QuizFormAnswer, QuizFormQuestion } from '.';
import { useNavigation } from 'react-router-dom';
import { useState } from 'react';

const QuizForm = ({
	onSubmit,
	quizTitleRow,
	quizTitleValue,
	quizTitleDefault,
}) => {
	// SINGLE FORM STATE
	const [questions, setQuestions] = useState([
		{
			questionText: '',
			answerType: '',
			options: [{ optionText: '', isCorrect: false }], // Starting with one answer
			correctAnswer: '',
		},
	]);

	const navigation = useNavigation();
	const isSubmitting = navigation.state === 'submitting';

	const addNewAnswer = (questionIndex, e) => {
		e.preventDefault();
		const newQuestions = questions.map((question, idx) => {
			if (idx === questionIndex) {
				return {
					...question,
					options: [
						...question.options,
						{ optionText: '', isCorrect: false },
					],
				};
			}
			return question;
		});
		setQuestions(newQuestions);
	};

	const setCorrectAnswer = (questionIndex, answerIndex) => {
		const updatedQuestions = questions.map((question, idx) => {
			if (idx === questionIndex) {
				return {
					...question,
					correctAnswer: answerIndex,
					options: question.options.map((option, optIndex) => ({
						...option,
						isCorrect: optIndex === answerIndex,
					})),
				};
			}
			return question;
		});
		setQuestions(updatedQuestions);
	};

	const deleteAnswer = (questionIndex, answerIndex) => {
		const newQuestions = questions.map((question, index) => {
			if (index === questionIndex) {
				return {
					...question,
					options: question.options.filter(
						(_, optIndex) => optIndex !== answerIndex
					),
				};
			}
			return question;
		});
		setQuestions(newQuestions);
	};

	return (
		<div className="flex justify-center align-middle w-screen h-fit">
			<Form
				method="post"
				onSubmit={onSubmit}
				className="flex flex-col justify-center items-center drop-shadow-lg w-full m-3 md:mx-5 my-4 lg:w-10/12 xl:w-7/12 2xl:w-5/12"
			>
				<div className="flex flex-col justify-center w-full md:mx-2 my-1">
					<div className="w-full mx-4 my-2">
						<FormRow
							type="text"
							name="quizTitle"
							labelText="Quiz Title"
							placeholder="quiz title"
							onChange={quizTitleRow}
							value={quizTitleValue}
							defaultValue={quizTitleDefault}
						/>
					</div>
					{questions.map((question, questionIndex) => (
						<div
							key={questionIndex}
							className="flex flex-col justify-center align-middle lg:border border-slate-400 lg:p-6 my-4"
						>
							<QuizFormQuestion
							// questionTypeOnChange={questionText}
							// questionTypeValue={question.answerType}
							// questionTypeDefault={(content) =>
							//   updateQuestionProperty(index, "questionText", content)
							// }
							// answerTypeOnChange={(e) =>
							//   updateQuestionProperty(index, "answerType", e.target.value)
							// }
							/>
							{question.options.map((option, optionIndex) => (
								<QuizFormAnswer
									key={optionIndex}
									index={optionIndex}
									answerValue={option.optionText}
									deleteClick={() =>
										deleteAnswer(questionIndex, optionIndex)
									}
									questionIndex={questionIndex}
									setCorrectAnswer={setCorrectAnswer}
									isCorrect={
										optionIndex === question.correctAnswer
									}
								/>
							))}
							<div className="flex justify-center">
								<button
									onClick={(e) =>
										addNewAnswer(questionIndex, e)
									}
									type="button"
									className="flex justify-center w-2/3 my-8 text-white text-xl bg-third hover:bg-white hover:border hover:border-third hover:text-third hover:shadow-xl hover:shadow-slate-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								>
									Add Answer
								</button>
							</div>
						</div>
					))}
					<div className="flex flex-col 2xl:flex-row mx-4 mt-8">
						<button
							type="submit"
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							{isSubmitting ? 'submitting...' : 'create'}
						</button>
					</div>
				</div>
			</Form>
		</div>
	);
};

export default QuizForm;
