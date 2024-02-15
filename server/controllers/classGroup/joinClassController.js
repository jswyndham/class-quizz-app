import ClassGroup from '../../models/ClassModel.js';
import Student from '../../models/StudentModel.js';
import Membership from '../../models/MembershipModel.js';
import { StatusCodes } from 'http-status-codes';
import { clearCache } from '../../utils/cache/cache.js';
import hasPermission from '../../utils/hasPermission.js';
import QuizAttempt from '../../models/QuizAttemptModel.js';
import User from '../../models/UserModel.js';

// Controller to allow students to join a class with an access code
export const joinClassWithCode = async (req, res) => {
	const { accessCode } = req.body;
	const userId = req.user.userId;
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

		// Find the user's existing membership
		const membership = await Membership.findOne({ user: userId });
		if (!membership) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Membership not found' });
		}

		// Check if class is already in user's class list
		const isClassAlreadyJoined = membership.classList.some(
			(classItem) =>
				classItem.class.toString() === classGroup._id.toString()
		);

		if (isClassAlreadyJoined) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Already joined the class' });
		}

		// Add class to existing membership
		membership.classList.push({ class: classGroup._id });
		await membership.save();

		// Add membership to the class group
		classGroup.membership.push(membership._id);
		await classGroup.save();

		// Update user's membership array in user schema
		const user = await User.findById(userId);
		if (user && !user.membership.includes(membership._id)) {
			user.membership.push(membership._id);
			await user.save();
		}

		// Clear related caches
		clearCache(`class_${classGroup._id}`);
		clearCache(`membership_${userId}`);
		clearCache(`user_${userId}`);

		res.status(StatusCodes.OK).json({
			message: 'Joined class successfully',
			membership,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
