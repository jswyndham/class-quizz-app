import { StatusCodes } from 'http-status-codes';
import Quiz from '../../models/QuizModel.js';
import ClassGroup from '../../models/ClassModel.js';
import { clearCache } from '../../utils/cache/cache.js';
import AuditLog from '../../models/AuditLogModel.js';
import hasPermission from '../../utils/hasPermission.js';

// Controller to copy a quiz to a class
export const copyQuizToClass = async (req, res) => {
	try {
		// Verify user permissions
		const userRole = req.user.userStatus;
		if (!hasPermission(userRole, 'COPY_QUIZ')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const { quizId } = req.params;
		const classId = req.params.classId;

		// Validate if the class exists
		const classGroup = await ClassGroup.findById(classId);
		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Class not found' });
		}

		// Define and fetch the original quiz
		const originalQuiz = await Quiz.findById(quizId);
		if (!originalQuiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Quiz not found' });
		}

		// Deep clone the quiz and prepare for new quiz creation
		const newQuizData = JSON.parse(JSON.stringify(originalQuiz.toObject()));
		delete newQuizData._id; // Remove the original ID
		newQuizData.class = [classId]; // Set the new class ID

		// Create and save the new quiz
		const newQuiz = new Quiz(newQuizData);
		await newQuiz.save();

		// Update the class with the new quiz
		await ClassGroup.findByIdAndUpdate(classId, {
			$addToSet: { quizzes: newQuiz._id },
		});

		// Fetch students in the class from Membership collection
		const memberships = await Membership.find({
			'classList.class': classId,
		}).select('user -_id');

		// Prepare bulk operations (use the bulkWrite() method) for updating student quiz attempts. This method sends all update operations to MongoDB in a single request, and reduces network overhead and database load.
		const bulkOps = memberships.map((membership) => ({
			insertOne: {
				document: {
					student: membership.user,
					quiz: newQuiz._id,
					answers: [], // Initialize with empty answers
				},
			},
		}));

		// Execute bulk operation to create quiz attempts
		if (bulkOps.length) {
			await QuizAttempt.bulkWrite(bulkOps);
		}

		// Create an audit log entry of the user's action
		const auditLog = new AuditLog({
			action: 'COPY_QUIZ_TO_CLASS',
			subjectType: 'Quiz',
			subjectId: newQuiz._id,
			userId: req.user.userId,
			details: { reason: 'Quiz copied to another class' },
		});
		await auditLog.save();

		// Clear relevant caches
		clearCache(`class_${req.user.userId}_${classId}`);
		clearCache(`quiz_${req.user.userId}_${quizId}`);

		res.status(StatusCodes.OK).json({
			msg: 'Quiz copied to class successfully',
			newQuizId: newQuiz._id,
		});
	} catch (error) {
		console.error('Error copying quiz to class:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
