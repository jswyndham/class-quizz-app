import ClassGroup from '../../models/ClassModel.js';
import Student from '../../models/StudentModel.js';
import Membership from '../../models/MembershipModel.js';
import { StatusCodes } from 'http-status-codes';
import { clearCache } from '../../utils/cache/cache.js';
import hasPermission from '../../utils/hasPermission.js';
import QuizAttempt from '../../models/QuizAttemptModel.js';

// Controller to allow students to join a class with an access code
export const joinClassWithCode = async (req, res) => {
	const { accessCode } = req.body;
	const studentId = req.user.userId;
	const userRole = req.user.userStatus;

	if (!hasPermission(userRole, 'JOIN_CLASS')) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ msg: 'You are unauthorized to join this class' });
	}

	try {
		const classGroup = await ClassGroup.findOne({ accessCode: accessCode });
		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Class not found' });
		}

		// Check if student is already a member
		const existingMembership = await Membership.findOne({
			user: studentId,
			'classList.class': classGroup._id,
		});

		if (!existingMembership) {
			// Create a new membership if not already a member
			const newMembership = await Membership.create({
				user: studentId,
				userStatus: USER_STATUS.STUDENT.value,
				classList: [{ class: classGroup._id }],
			});

			// Update Student to include the new membership
			await Student.updateOne(
				{ user: studentId },
				{ $push: { classMembership: newMembership._id } }
			);

			// Assign all quizzes available to this class to the new student
			const quizAttempts = classGroup.quizzes.map((quiz) => ({
				student: studentId,
				quiz: quiz._id,
				answers: [],
			}));
			await QuizAttempt.insertMany(quizAttempts);

			// Clear the cache
			const cacheKey = `class_${accessCode}`;
			clearCache(cacheKey);
		} else {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'You are already a member of this group' });
		}

		res.status(StatusCodes.OK).json({
			message: 'Joined group successfully',
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
