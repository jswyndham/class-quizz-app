import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import sanitizeHtml from 'sanitize-html';
import Quiz from '../../models/QuizModel.js';
import ClassGroup from '../../models/ClassModel.js';
import QuizAttempt from '../../models/QuizAttemptModel.js';
import Membership from '../../models/MembershipModel.js';
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

		const userId = req.user.userId;
		let { ...quizData } = req.body;
		const { classId } = req.body;

		// Sanitize quiz title and description
		quizData.quizTitle = sanitizeHtml(quizData.quizTitle, sanitizeConfig);
		quizData.quizDescription = sanitizeHtml(
			quizData.quizDescription,
			sanitizeConfig
		);

		// Sanitize questions
		if (quizData.questions && quizData.questions.length > 0) {
			quizData.questions = quizData.questions.map((question) => ({
				...question,
				questionText: sanitizeHtml(
					question.questionText,
					sanitizeConfig
				),
			}));
		}

		// Validate the existence of class and fetch students
		const classes = await ClassGroup.find({
			_id: { $in: classId },
		}).populate('membership');
		if (classes.length !== classId.length) {
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

		// Update each class with the new quiz ID
		await Promise.all(
			classId.map(async (id) => {
				await ClassGroup.findByIdAndUpdate(id, {
					$push: { quizzes: newQuiz._id },
				});
			})
		);

		// Prepare bulk operations for QuizAttempt
		const quizAttemptBulkOps = [];

		classes.forEach((classGroup) => {
			classGroup.membership.forEach((membershipId) => {
				// Create QuizAttempt for each member of the class
				quizAttemptBulkOps.push({
					insertOne: {
						document: {
							member: membershipId,
							quiz: newQuiz._id, // Create a reference the original Quiz object it's associated with. This way the user is given a reference number and can fetch the quizAttempt when ready.
							answers: [],
							isVisibleToStudent: true,
						},
					},
				});
			});
		});

		// Execute bulk operations
		if (quizAttemptBulkOps.length) {
			await QuizAttempt.bulkWrite(quizAttemptBulkOps);
		}

		// Audit log and response
		const auditLog = new AuditLog({
			action: 'CREATE_QUIZ',
			subjectType: 'Quiz',
			subjectId: newQuiz._id,
			userId,
			details: { reason: 'Quiz created and assigned' },
		});
		await auditLog.save();

		// Clear the cache for affected classes, the new quiz, and all quizzes by the user
		classId.forEach((id) => {
			clearCache(`class_${id}`);
		});
		clearCache(`quiz_${newQuiz._id}`);
		clearCache(`quiz_${userId}`);

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
