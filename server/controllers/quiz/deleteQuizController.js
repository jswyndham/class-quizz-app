import { StatusCodes } from 'http-status-codes';
import Quiz from '../../models/QuizModel.js';
import ClassGroup from '../../models/ClassModel.js';
import { clearCache } from '../../utils/cache/cache.js';
import AuditLog from '../../models/AuditLogModel.js';
import hasPermission from '../../utils/hasPermission.js';

// Controller to delete a quiz
export const deleteQuiz = async (req, res) => {
	try {
		// Verify user permissions
		const userRole = req.user.userStatus;

		if (!hasPermission(userRole, 'DELETE_QUIZ')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const userId = req.user.userId;
		const quizId = req.params.id;

		// Find the quiz by id and delete
		const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
		if (!deletedQuiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Quiz not found' });
		}

		// Update classes and handle quiz attempts (if needed)
		await ClassGroup.updateMany(
			{ quizzes: quizId },
			{ $pull: { quizzes: quizId } }
		);

		// Audit log and cache clearing
		const auditLog = new AuditLog({
			action: 'DELETE_QUIZ',
			subjectType: 'Quiz',
			subjectId: quizId,
			userId: userId,
			details: { reason: 'Quiz deleted' },
		});
		await auditLog.save();

		// Clear the cache for the updated quiz
		const quizCacheKey = `quiz_${userId}_${quizId}`;
		// Clear the all quizzes cache
		const quizzesCacheKey = `quizzes_${userId}`;
		// Clear cache for all classes
		const allClassesCacheKey = `class_${userId}`;
		// Clear cache for quiz attempt
		const quizAttemptCacheKey = `quizAttempt_${quizAttemptId}`;

		const membershipCacheKey = `membership_${userId}`;

		clearCache(quizCacheKey);
		clearCache(quizzesCacheKey);
		clearCache(allClassesCacheKey);
		clearCache(quizAttemptCacheKey);
		clearCache(membershipCacheKey);

		res.status(StatusCodes.OK).json({
			msg: 'Quiz deleted',
			quizId: quizId,
		});
	} catch (error) {
		console.error('Error deleting quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
