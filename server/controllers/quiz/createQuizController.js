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
			return res.status(StatusCodes.FORBIDDEN).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const userId = req.user.userId;
		let { ...quizData } = req.body;
		const classIds = req.body.classId;

		// Validate classId array
		if (
			!Array.isArray(classIds) ||
			classIds.some((id) => !mongoose.isValidObjectId(id))
		) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Invalid class IDs.' });
		}

		// Sanitize quiz data
		quizData.quizTitle = sanitizeHtml(quizData.quizTitle, sanitizeConfig);
		quizData.quizDescription = sanitizeHtml(
			quizData.quizDescription,
			sanitizeConfig
		);
		quizData.questions = quizData.questions.map((question) => ({
			...question,
			questionText: sanitizeHtml(question.questionText, sanitizeConfig),
		}));

		// Fetch classes and validate their existence
		const classes = await ClassGroup.find({ _id: { $in: classIds } });
		if (classes.length !== classIds.length) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'One or more class IDs are invalid or do not exist.',
			});
		}

		// Create the new quiz
		const newQuiz = await Quiz.create({
			...quizData,
			createdBy: userId,
			class: classIds,
		});

		// Update classes with the new quiz
		await ClassGroup.updateOne(
			{ _id: classIds },
			{ $push: { quizzes: newQuiz._id } }
		);

		// Prepare and execute bulk operations for QuizAttempt
		const quizAttemptBulkOps = classes.flatMap((classGroup) =>
			classGroup.membership.map((membership) => ({
				insertOne: {
					document: {
						member: membership,
						quiz: newQuiz._id,
						class: classGroup._id,
						answers: [],
						isVisibleToStudent: true,
					},
				},
			}))
		);

		// Execute bulk operations and update memberships
		if (quizAttemptBulkOps.length > 0) {
			const createdQuizAttempts = await QuizAttempt.bulkWrite(
				quizAttemptBulkOps
			);

			// Iterate over each operation to update the corresponding membership
			quizAttemptBulkOps.forEach(async (op, index) => {
				const quizAttemptId = createdQuizAttempts.insertedIds[index];
				const membershipId = op.insertOne.document.member;
				const classIdForQuizAttempt = op.insertOne.document.class;

				await Membership.updateOne(
					{
						_id: membershipId,
						'classList.class': classIdForQuizAttempt,
					},
					{ $push: { 'classList.$.quizAttempts': quizAttemptId } }
				);
			});
		}

		// Clear caches after all operations
		classIds.forEach((cid) => clearCache(`class_${cid}`));
		clearCache(`quiz_${newQuiz._id}`);
		clearCache(`quiz_${userId}`);
		clearCache(`class_${userId}`);
		clearCache(`membership_${userId}`);

		// Audit log and response
		const auditLog = new AuditLog({
			action: 'CREATE_QUIZ',
			subjectType: 'Quiz',
			subjectId: newQuiz._id,
			userId,
			details: { reason: 'Quiz created and assigned' },
		});
		await auditLog.save();

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
