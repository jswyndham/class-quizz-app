import { StatusCodes } from 'http-status-codes';
import sanitizeHtml from 'sanitize-html';
import Quiz from '../../models/QuizModel.js';
import ClassGroup from '../../models/ClassModel.js';
import { clearCache } from '../../utils/cache/cache.js';
import AuditLog from '../../models/AuditLogModel.js';
import sanitizeConfig from './quizUtils.js';
import hasPermission from '../../utils/hasPermission.js';

// Controller to create a new quiz and assign it to students
export const createAndAssignQuiz = async (req, res) => {
	try {
		// Verify user permissions
		const userRole = req.user.userStatus;
		if (!hasPermission(userRole, 'CREATE_QUIZ')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		// User ID and class IDs
		const userId = req.user.userId;
		const classId = req.params.classId;
		let { ...quizData } = req.body;

		// Sanitize quiz title and description
		quizData.quizTitle = sanitizeHtml(quizData.quizTitle, sanitizeConfig);
		quizData.quizDescription = sanitizeHtml(
			quizData.quizDescription,
			sanitizeConfig
		);

		// Sanitize questions
		if (quizData.questions && quizData.questions.length > 0) {
			quizData.questions = quizData.questions.map((question) => {
				return {
					...question,
					questionText: sanitizeHtml(
						question.questionText,
						sanitizeConfig
					),
				};
			});
		}

		// Validate the existence of class and fetch students
		const classes = await ClassGroup.find({
			_id: { $in: classId },
		}).populate('membership');

		if (classes.length !== classIds.length) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'One or more class IDs are invalid or do not exist.',
			});
		}

		// Create the new quiz
		const newQuiz = await Quiz.create({
			...quizData,
			createdBy: userId,
			class: classId,
		});

		// After creating the quiz, update each class with the new quiz ID
		await Promise.all(
			classIds.map(async (classId) => {
				await ClassGroup.findByIdAndUpdate(classId, {
					$push: { quizzes: newQuiz._id },
				});
			})
		);

		// Prepare bulk operations (use the bulkWrite() method) for updating student quiz attempts. This method sends all update operations to MongoDB in a single request, and reduces network overhead and database load.
		const bulkOps = [];
		classes.forEach((classGroup) => {
			classGroup.membership.forEach((membership) => {
				bulkOps.push({
					insertOne: {
						document: {
							student: membership.user,
							quiz: newQuiz._id,
							answers: [], // Initialize with empty answers
						},
					},
				});
			});
		});

		// Execute bulk operation to create quiz attempts
		if (bulkOps.length) {
			await QuizAttempt.bulkWrite(bulkOps);
		}

		// Audit log and response
		const auditLog = new AuditLog({
			action: 'CREATE_QUIZ',
			subjectType: 'Quiz',
			subjectId: newQuiz._id,
			userId: userId,
			details: { reason: 'Quiz created and assigned' },
		});
		await auditLog.save();

		// Clear the cache for affected classes, the new quiz, and all quizzes by the user
		classId.forEach((classId) => {
			clearCache(`class_${classId}`);
		});
		clearCache(`quiz_${newQuiz._id}`);
		clearCache(`quiz_${userId}`); // Clear cache for all quizzes by the user

		// Send response
		res.status(StatusCodes.CREATED).json({
			message: 'Quiz created and assigned to students',
			quiz: newQuiz,
		});
	} catch (error) {
		console.error('Error in creating and assigning quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
