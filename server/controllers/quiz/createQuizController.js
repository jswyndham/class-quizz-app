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
		// *********** Permission based on user role **************
		const userRole = req.user.userStatus;
		if (!hasPermission(userRole, 'CREATE_QUIZ')) {
			return res.status(StatusCodes.FORBIDDEN).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		// ************** Define params ******************
		const userId = req.user.userId;
		const { classId: classIds, ...quizData } = req.body;

		// ************** Sanitize and structure quiz data *************
		quizData.quizTitle = sanitizeHtml(quizData.quizTitle, sanitizeConfig);
		quizData.quizDescription = sanitizeHtml(
			quizData.quizDescription,
			sanitizeConfig
		);
		quizData.questions = quizData.questions.map((question) => ({
			...question,
			questionText: sanitizeHtml(question.questionText, sanitizeConfig),
		}));

		// ************** Validate class IDs ****************
		if (
			!Array.isArray(classIds) ||
			classIds.some((id) => !mongoose.isValidObjectId(id))
		) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Invalid class IDs.' });
		}

		// ************* Create quiz bject **************
		const newQuiz = await Quiz.create({
			...quizData,
			createdBy: userId,
			class: classIds,
		});

		// ***** Update the specific ClassGroup to include quiz object ******
		await ClassGroup.findByIdAndUpdate(req.body.classId, {
			$push: { quizzes: newQuiz._id },
		});

		// ************ Find classes and validate existence ************
		const classes = await ClassGroup.find({ _id: { $in: classIds } });
		if (classes.length !== classIds.length) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'One or more class IDs are invalid or do not exist.',
			});
		}

		// ****** Create QuizAttempt documents for each class member ******
		let quizAttemptBulkOps = [];
		classes.forEach((classGroup) => {
			classGroup.membership.forEach((member) => {
				quizAttemptBulkOps.push({
					insertOne: {
						document: {
							member: member,
							quiz: newQuiz._id,
							class: classGroup._id,
							answers: [],
							isVisibleToStudent: true, // default visibility
						},
					},
				});
			});
		});

		// ************ Perform bulk creation of quiz attempts **********
		if (quizAttemptBulkOps.length > 0) {
			await QuizAttempt.bulkWrite(quizAttemptBulkOps);
		}

		// ************** Clear relevant caches ***************
		classIds.forEach((cid) => clearCache(`class_${cid}`));
		clearCache(`quiz_${newQuiz._id}`);
		clearCache(`quiz_${userId}`);
		clearCache(`user_${userId}`);
		clearCache(`class_${userId}`);

		// ********** Audit log entry ****************
		const auditLog = new AuditLog({
			action: 'CREATE_QUIZ',
			subjectType: 'Quiz',
			subjectId: newQuiz._id,
			userId,
			details: { reason: 'Quiz created and assigned' },
		});
		await auditLog.save();

		//  **************** Send response ******************
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
