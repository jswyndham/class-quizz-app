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
		// ************** Verify user permissions ************
		const userRole = req.user.userStatus;
		if (!hasPermission(userRole, 'UPDATE_QUIZ')) {
			return res.status(StatusCodes.FORBIDDEN).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		// ************** Define params ******************
		const quizId = req.params.id; // ID of the quiz being updated
		const userId = req.user.userId;
		const { ...quizData } = req.body;

		// ********** Sanitize HTML content in quiz data ************
		quizData.quizTitle = sanitizeHtml(quizData.quizTitle, sanitizeConfig);
		quizData.quizDescription = sanitizeHtml(
			quizData.quizDescription,
			sanitizeConfig
		);
		quizData.questions = quizData.questions.map((question) => ({
			...question,
			questionText: sanitizeHtml(question.questionText, sanitizeConfig),
		}));

		// ** Find the existing quiz **
		const quiz = await Quiz.findById(quizId);
		if (!quiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Quiz not found' });
		}

		// ** Check if the quiz is within set active period **
		const now = new Date();
		if (now >= quiz.startDate && now <= quiz.endDate) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Quiz cannot be edited during its active period',
			});
		}

		// *** Update the quiz ***
		const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, quizData, {
			new: true,
		});

		// ************* Clear relevant caches **************
		clearCache(`quiz_${quizId}`);
		clearCache(`quiz_${userId}`);
		clearCache(`user_${userId}`);
		clearCache(`class_${userId}`);

		console.log('Updated Quiz Load: ', updatedQuiz);

		//  **************** Send response ******************
		res.status(StatusCodes.OK).json({
			message: 'Quiz updated successfully',
			quiz: updatedQuiz,
		});
	} catch (error) {
		console.error('Error updating quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
