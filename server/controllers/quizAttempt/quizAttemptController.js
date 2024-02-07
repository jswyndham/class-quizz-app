import { StatusCodes } from 'http-status-codes';
import QuizAttempt from '../../models/QuizAttemptModel.js';
import { clearCache, setCache } from '../../utils/cache/cache.js';
import Student from '../../models/StudentModel.js';

// Controller to duplicate quiz for each student in a class
export const assignQuizToStudents = async (req, res) => {
	const { quizId, classId } = req.params;

	try {
		// Fetch students in the class
		const students = await Student.find({
			'classMembership.class': classId,
		});

		// Duplicate the quiz for each student
		students.forEach(async (student) => {
			await QuizAttempt.create({
				student: student._id,
				quiz: quizId,
				answers: [], // Initialize with empty answers
				// Other fields are set to default
			});
		});

		// Define and fetch the original quiz
		const originalQuiz = await Quiz.findById(_id);
		if (!originalQuiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Quiz not found' });
		}

		// Deep clone the quiz and prepare for new quiz creation. The 'toObject()' method creates a new object, which is filled with the copy, 'JSON.parse(JSON.stringify(...))'
		const newQuizData = JSON.parse(JSON.stringify(originalQuiz.toObject()));
		delete newQuizData._id; // Remove the original ID
		newQuizData.class = [classId]; // Set the new class ID

		// Create and save the new quiz
		const newQuiz = new Quiz(newQuizData);
		await newQuiz.save();

		// Update the class with the new quiz in the 'quizzes' array in classGroup schema.
		await ClassGroup.findByIdAndUpdate(classId, {
			$addToSet: { quizzes: newQuiz._id },
		});

		res.status(StatusCodes.OK).json({
			message: 'Quiz assigned to students',
		});
	} catch (error) {
		console.error('Error assigning quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller for a student to attempt a quiz
export const submitQuizAttempt = async (req, res) => {
	const { studentId, quizId } = req.params;
	const answers = req.body.answers;

	try {
		// Find the student's quiz attempt
		let quizAttempt = await QuizAttempt.findOne({
			student: studentId,
			quiz: quizId,
		});

		if (!quizAttempt) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz attempt not found' });
		}

		// Update the quiz attempt with the student's answers
		quizAttempt.answers = answers;
		quizAttempt.completed = true;
		await quizAttempt.save();

		res.status(StatusCodes.OK).json({ message: 'Quiz attempt updated' });
	} catch (error) {
		console.error('Error attempting quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller for scoring a quiz attempt
export const scoreQuizAttempt = async (req, res) => {
	const { quizAttemptId } = req.params;

	try {
		const quizAttempt = await QuizAttempt.findById(quizAttemptId).populate(
			'quiz'
		);
		if (!quizAttempt) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz attempt not found' });
		}

		let score = 0;
		quizAttempt.answers.forEach((answer) => {
			const correspondingQuestion = quizAttempt.quiz.questions.find(
				(question) => question._id.equals(answer.questionId)
			);
			if (
				correspondingQuestion &&
				correspondingQuestion.correctAnswer === answer.selectedOption
			) {
				score += correspondingQuestion.points; // Add points for correct answer
			}
		});

		quizAttempt.score = score;
		quizAttempt.isFullyScored = true;
		await quizAttempt.save();

		res.status(StatusCodes.OK).json({
			message: 'Quiz scored successfully',
			score,
		});
	} catch (error) {
		console.error('Error scoring quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to save quiz results in student's profile
export const saveQuizResults = async (req, res) => {
	const { studentId, quizAttemptId } = req.params;

	try {
		// Retrieve the quiz attempt
		const quizAttempt = await QuizAttempt.findById(quizAttemptId);

		// Update the student's performance record
		await Student.updateOne(
			{ _id: studentId, 'performance.class': quizAttempt.quiz },
			{ $push: { 'performance.$.quizzesTaken': quizAttemptId } }
		);

		res.status(StatusCodes.OK).json({ message: 'Quiz results saved' });
	} catch (error) {
		console.error('Error saving quiz results:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to update student's performance after a quiz attempt
export const updateStudentPerformance = async (req, res) => {
	const { studentId, quizAttemptId } = req.params;

	try {
		const quizAttempt = await QuizAttempt.findById(quizAttemptId);
		if (!quizAttempt) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz attempt not found' });
		}

		// Update the student's performance
		const update = {
			$push: { 'performance.$.quizzesTaken': quizAttemptId },
			$inc: { 'performance.$.totalScore': quizAttempt.score },
		};
		await Student.updateOne(
			{ _id: studentId, 'performance.class': quizAttempt.quiz },
			update
		);

		res.status(StatusCodes.OK).json({
			message: 'Student performance updated',
		});
	} catch (error) {
		console.error('Error updating student performance:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
