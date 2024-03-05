import ClassGroup from '../../models/ClassModel.js';
import Membership from '../../models/MembershipModel.js';
import QuizAttempt from '../../models/QuizAttemptModel.js';
import { StatusCodes } from 'http-status-codes';
import { clearCache } from '../../utils/cache/cache.js';
import hasPermission from '../../utils/hasPermission.js';

// Controller for user to join class group using a 'class code'
export const joinClassWithCode = async (req, res) => {
	const { accessCode } = req.body;
	const userId = req.user.userId;
	const membershipId = req.params.membershipId;
	const userRole = req.user.userStatus;
	const classId = req.params.classId;

	if (!hasPermission(userRole, 'JOIN_CLASS')) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ message: 'You are unauthorized to join this class' });
	}

	try {
		// Find the class group by access code
		const classGroup = await ClassGroup.findOne({ accessCode }).populate(
			'quizzes'
		);
		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Class not found' });
		}

		// Check if the user is already a member of the class
		const existingMembership = await Membership.findOne({
			user: userId,
			'classList.class': classGroup._id,
		});
		if (existingMembership) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'You are already a member of this class' });
		}

		// Update the user's membership
		const membership = await Membership.findOneAndUpdate(
			{ user: userId },
			{ $addToSet: { classList: { class: classGroup._id } } },
			{ new: true, upsert: true }
		);

		// Clone existing quizzes and create quiz attempts
		const quizAttempts = await Promise.all(
			classGroup.quizzes.map(async (quiz) => {
				return QuizAttempt.create({
					member: userId,
					quiz: quiz._id,
					class: classGroup._id,
					answers: [],
					isVisibleToStudent: true,
				});
			})
		);

		// Add quiz attempts to the user's membership
		await Membership.findByIdAndUpdate(
			membership._id,
			{
				$push: {
					'classList.$[elem].quizAttempts': {
						$each: quizAttempts.map((qa) => qa._id),
					},
				},
			},
			{
				arrayFilters: [{ 'elem.class': classGroup._id }],
				new: true,
			}
		);

		// Add membership to the class group
		await ClassGroup.findByIdAndUpdate(classGroup._id, {
			$addToSet: { membership: membership._id },
		});

		// Clear related caches
		clearCache(`class_${classId}`);
		clearCache(`membership_${userId}`);
		clearCache(`membership_${membershipId}`);
		clearCache(`user_${userId}`);

		res.status(StatusCodes.OK).json({
			message: 'Joined class and quizzes assigned successfully',
			classData: classGroup,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
