import ClassGroup from '../../models/ClassModel.js';
import Membership from '../../models/MembershipModel.js';
import Student from '../../models/StudentModel.js';
import { StatusCodes } from 'http-status-codes';
import { clearCache } from '../../utils/cache/cache.js';
import hasPermission from '../../utils/hasPermission.js';

// Controller for user to join class group using a 'class code'
export const joinClassWithCode = async (req, res) => {
	const { accessCode } = req.body;
	const userId = req.user.userId;
	const userRole = req.user.userStatus;

	if (!hasPermission(userRole, 'JOIN_CLASS')) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ message: 'You are unauthorized to join this class' });
	}

	try {
		// Find the class group by access code
		const classGroup = await ClassGroup.findOne({ accessCode })
			.populate('quizzes') // Assuming you have quizzes linked to ClassGroup
			.populate({
				path: 'membership',
				populate: {
					path: 'user', // Populate user data in membership if needed
				},
			});
		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Class not found' });
		}

		// Update or create the user's membership
		const membership = await Membership.findOneAndUpdate(
			{ user: userId },
			{ $addToSet: { classList: { class: classGroup._id } } },
			{ new: true, upsert: true }
		);

		// Add membership to the class group
		await ClassGroup.findByIdAndUpdate(classGroup._id, {
			$addToSet: { membership: membership._id },
		});

		// Update the membership with the class's quiz attempts
		await Membership.updateOne(
			{ _id: membership._id, 'classList.class': classGroup._id },
			{
				$addToSet: {
					'classList.$.quizAttempts': {
						$each: classGroup.quizAttempt.map((qa) => qa._id),
					},
				},
			}
		);

		// Update quizzes taken in the Student schema
		await Student.updateOne(
			{ user: userId, 'performance.class': classGroup._id },
			{
				$addToSet: {
					'performance.$.quizAttempts': {
						$each: classGroup.quizAttempt.map((qa) => qa._id),
					},
				},
			},
			{ upsert: true }
		);

		// Clear related caches
		clearCache(`class_${classGroup._id}`);
		clearCache(`membership_${userId}`);
		clearCache(`user_${userId}`);

		res.status(StatusCodes.OK).json({
			message: 'Joined class successfully',
			classData: classGroup,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
