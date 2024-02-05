import { StatusCodes } from 'http-status-codes';
import sanitizeHtml from 'sanitize-html';
import Quiz from '../../models/QuizModel.js';
import ClassGroup from '../../models/ClassModel.js';
import { clearCache } from '../../utils/cache/cache.js';
import AuditLog from '../../models/AuditLogModel.js';
import { ROLE_PERMISSIONS } from '../../utils/constants.js';
import sanitizeConfig from './quizUtils.js';

const hasPermission = (userRole, action) => {
	return (
		ROLE_PERMISSIONS[userRole] &&
		ROLE_PERMISSIONS[userRole].includes(action)
	);
};

// Controller to create a new quiz
export const createQuiz = async (req, res) => {
	try {
		// Verify user permissions
		const userRole = req.user.userStatus;

		if (!hasPermission(userRole, 'CREATE_QUIZ')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		// User ID
		const userId = req.user.userId;

		// Extract classId from the request body
		let { class: classIds, ...quizData } = req.body;

		// Sanitize and prepare questions data
		quizData.questions = quizData.questions?.map((question) => {
			const correctOption = question.options?.find(
				(option) => option.isCorrect
			);
			return {
				...question,
				questionText: sanitizeHtml(
					question.questionText,
					sanitizeConfig
				),
				correctAnswer: correctOption?.optionText ?? null,
			};
		});

		// Ensure classIds is an array and contains valid MongoDB ObjectId
		classIds = Array.isArray(classIds) ? classIds : [classIds];

		// Validate the existence of class
		const validClassCount = await ClassGroup.countDocuments({
			_id: { $in: classIds },
		});

		if (validClassCount !== classIds.length) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'One or more class IDs are invalid or do not exist.',
			});
		}

		// Create new quiz with classIds
		const newQuiz = await Quiz.create({
			...quizData,
			createdBy: userId,
			class: classIds,
		});

		// Create an audit log entry of the user's action
		if (newQuiz) {
			const auditLog = new AuditLog({
				action: 'CREATE_QUIZ',
				subjectType: 'Quiz',
				subjectId: newQuiz._id,
				userId: userId,
				details: { reason: 'Quiz created' },
			});
			await auditLog.save();
		}

		// Update the corresponding class object with the new quiz
		await Promise.all(
			classIds.map(async (classId) => {
				try {
					await ClassGroup.findByIdAndUpdate(
						classId,
						{ $push: { quizzes: newQuiz._id } },
						{ new: true }
					);

					// Clear the cache for this specific class
					const specificClassCacheKey = `class_${userId}_${classId}`;
					clearCache(specificClassCacheKey);
				} catch (err) {
					console.error(`Error updating class ${classId}:`, err);
				}
			})
		);

		// Clear cache related to the user's classes and quizzes
		clearCache(`class_${userId}`, `quiz_${userId}`);

		res.status(StatusCodes.CREATED).json({ quiz: newQuiz });
	} catch (error) {
		console.error('Error creating quiz:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

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

		// Get the id of the quiz being updated
		const id = req.params.id;
		let { class: classIds, ...quizData } = req.body;

		// Handle cases where classIds might not be an array
		classIds = Array.isArray(classIds) ? classIds : [classIds];

		// Sanitize and update questions data
		if (quizData.questions && quizData.questions.length > 0) {
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
					correctAnswer: correctOption
						? correctOption.optionText
						: null,
				};
			});
		}

		// Find the quiz before upadating and check that it exists
		const existingQuiz = await Quiz.findById(id);

		if (!existingQuiz) {
			return res.status(StatusCodes.NOT_FOUND).json({
				msg: 'Quiz not found',
			});
		}

		// Update the quiz
		const updatedQuiz = await Quiz.findByIdAndUpdate(
			id,
			{ ...quizData, class: classIds },
			{ new: true, timestamps: true }
		)
			.populate({ path: 'class' })
			.exec();

		if (!updatedQuiz) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Quiz not found' });
		}

		// Manual computation of virtual fields. This is performed here due to an error caused by Mongoose related to the virtuals field in the schema.
		updatedQuiz.totalPoints = updatedQuiz.questions.reduce(
			(sum, question) => sum + question.points,
			0
		);
		updatedQuiz.questionCount = updatedQuiz.questions.length;

		// Create an audit log entry of the user's action
		if (updatedQuiz) {
			const auditLog = new AuditLog({
				action: 'UPDATE_OWN_QUIZ',
				subjectType: 'Quiz',
				subjectId: updatedQuiz._id,
				userId: userId,
				details: { reason: 'Quiz updated' },
			});
			await auditLog.save();
		}

		// Loop through the class array and clear cache for each class that contained the updated quiz
		updatedQuiz.class.forEach((classItem) => {
			const classCacheKey = `class_${userId}_${classItem._id.toString()}`;
			console.log('Class cache key: ', classCacheKey);

			clearCache(classCacheKey);
		});

		// Clear the cache for the updated quiz
		const quizCacheKey = `quiz_${userId}_${id}`;
		// Clear the all quizzes cache
		const quizzesCacheKey = `quizzes_${userId}`;
		// Clear cache for all classes
		const allClassesCacheKey = `class_${userId}`;

		clearCache(quizCacheKey);
		clearCache(quizzesCacheKey);
		clearCache(allClassesCacheKey);

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

// Controller to copy a quiz to a class
export const copyQuizToClass = async (req, res) => {
	try {
		const { _id, classId } = req.body;

		// Validate if the class exists
		const classGroup = await ClassGroup.findById(classId);
		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Class not found' });
		}

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

		// Create an audit log entry of the user's action
		if (newQuiz) {
			const auditLog = new AuditLog({
				action: 'COPY_QUIZ_TO_CLASS',
				subjectType: 'Quiz',
				subjectId: newQuiz._id,
				userId: req.user.userId,
				details: { reason: 'Quiz copied to another class' },
			});
			await auditLog.save();
		}

		// Clear the cache for both classes and quizzes when saved
		const quizCacheKey = `quiz_${req.user.userId}_${req.params.id}`;
		const allClassesCacheKey = `class_${req.user.userId}`;
		clearCache(allClassesCacheKey, quizCacheKey);

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

		// Delete the quiz and include classes that contained that quiz schema class array
		const quiz = await Quiz.findByIdAndDelete(quizId);
		const classesContainingQuiz = quiz ? quiz.class : [];

		// Update all ClassGroup documents that contain that quiz
		await ClassGroup.updateMany(
			{ quizzes: quizId },
			{ $pull: { quizzes: quizId } }
		);

		// Create an audit log entry of the user's action
		if (quiz) {
			const auditLog = new AuditLog({
				action: 'DELETE_QUIZ',
				subjectType: 'Quiz',
				subjectId: quizId,
				userId: userId,
				details: { reason: 'Quiz deleted' },
			});
			await auditLog.save();
		}
		// Clear the cache for the updated quiz
		const quizCacheKey = `quiz_${userId}_${quizId}`;
		// Clear the all quizzes cache
		const quizzesCacheKey = `quizzes_${userId}`;
		// Clear cache for all classes
		const allClassesCacheKey = `class_${userId}`;

		clearCache(quizCacheKey);
		clearCache(quizzesCacheKey);
		clearCache(allClassesCacheKey);

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
