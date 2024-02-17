import { StatusCodes } from 'http-status-codes';
import sanitizeHtml from 'sanitize-html';
import Quiz from '../../models/QuizModel.js';
import { clearCache } from '../../utils/cache/cache.js';
import AuditLog from '../../models/AuditLogModel.js';
import sanitizeConfig from './quizUtils.js';
import hasPermission from '../../utils/hasPermission.js';

// Controller to update an existing quiz
export const updateQuiz = async (req, res) => {
	try {
		// Verify user permissions
		const userRole = req.user.userStatus;
		if (!hasPermission(userRole, 'UPDATE_QUIZ')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const userId = req.user.userId;
		const quizId = req.params.id; // ID of the quiz being updated
		let { class: classId, ...quizData } = req.body; // Extract class IDs and quiz data from request

		// Ensure classId is always an array for consistent processing
		classId = Array.isArray(classId) ? classId : [classId];

		// Sanitize and update questions data
		quizData.questions = quizData.questions.map((question) => {
			const correctOption = question.options.find(
				(option) => option.isCorrect
			);
			return {
				...question,
				questionText: sanitizeHtml(
					question.questionText,
					sanitizeConfig
				),
				correctAnswer: correctOption ? correctOption.optionText : null,
			};
		});

		// Find and update the quiz
		const updatedQuiz = await Quiz.findByIdAndUpdate(
			quizId,
			{ ...quizData, class: classId },
			{ new: true, timestamps: true }
		).populate({ path: 'class' });

		if (!updatedQuiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Quiz not found' });
		}

		// Fetch student quiz attempts in bulk
		const studentQuizAttempts = await QuizAttempt.find({
			quiz: updatedQuiz._id,
		});

		// Prepare bulk operations (use the bulkWrite() method) for updating student quiz attempts. This method sends all update operations to MongoDB in a single request, and reduces network overhead and database load.
		const bulkOps = studentQuizAttempts.map((studentQuizAttempt) => ({
			updateOne: {
				filter: { _id: studentQuizAttempt._id },
				update: {
					answers: updatedQuiz.questions.map((question) => {
						const correspondingAnswer =
							studentQuizAttempt.answers.find((a) =>
								a.questionId.equals(question._id)
							);
						return {
							questionId: question._id,
							selectedOption: correspondingAnswer
								? correspondingAnswer.selectedOption
								: null,
							responseText: correspondingAnswer
								? correspondingAnswer.responseText
								: null,
						};
					}),
				},
			},
		}));

		// Perform the bulk update in one database operation
		await QuizAttempt.bulkWrite(bulkOps);

		// Manual computation of virtual fields
		updatedQuiz.totalPoints = updatedQuiz.questions.reduce(
			(sum, question) => sum + question.points,
			0
		);
		updatedQuiz.questionCount = updatedQuiz.questions.length;

		// Log the update action in the audit log
		const auditLog = new AuditLog({
			action: 'UPDATE_OWN_QUIZ',
			subjectType: 'Quiz',
			subjectId: updatedQuiz._id,
			userId: userId,
			details: { reason: 'Quiz updated' },
		});
		await auditLog.save();

		// Clear relevant caches
		clearCache(`class_${userId}`);
		clearCache(`quiz_${userId}`);

		res.status(StatusCodes.OK).json({
			msg: 'Quiz updated successfully',
			quiz: updatedQuiz,
		});
	} catch (error) {
		console.error('Error updating quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			msg: error.message,
		});
	}
};
