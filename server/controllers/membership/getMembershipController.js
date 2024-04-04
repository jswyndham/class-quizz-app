import Membership from '../../models/MembershipModel.js';
import { getCache, setCache } from '../../utils/cache/cache.js';
import hasPermission from '../../utils/hasPermission.js';
import { StatusCodes } from 'http-status-codes';

function processClassGroupVirtualsAndCache(classGroups) {
	classGroups.forEach((classGroup) => {
		// Check if quizzes and membership exist before accessing their length
		classGroup.quizCount = classGroup.quizzes
			? classGroup.quizzes.length
			: 0;
		classGroup.memberCount = classGroup.membership
			? classGroup.membership.length
			: 0;

		if (classGroup.quizzes) {
			classGroup.quizzes.forEach((quiz) => {
				quiz.questionCount = quiz.questions ? quiz.questions.length : 0;
				quiz.totalPoints = quiz.questions
					? quiz.questions.reduce(
							(sum, question) => sum + question.points,
							0
					  )
					: 0;
			});
		}
	});
}

// Get (find) all the class memberships a single student has joined
export const getAllMemberships = async (req, res) => {
	try {
		const userId = req.user.userId;
		const userRole = req.user.userStatus;

		// Define a cache key unique to the user
		const cacheKey = `membership_${userId}`;

		// Attempt to get cached data
		let cachedData = await getCache(cacheKey);

		// If cache is hit, return the cached data
		if (cachedData) {
			console.log(`Cache hit for key: ${cacheKey}`);
			return res.status(StatusCodes.OK).json({ classGroups: cachedData });
		}

		// Fetch all memberships for the user and populate class details and quizAttempts
		const userMembership = await Membership.findOne({ user: userId })
			.populate({ path: 'user', select: 'firstName lastName email' })
			.populate({
				path: 'classList.class',
				select: 'className subject school quizzes membership',
				populate: [
					{ path: 'quizzes', model: 'Quiz' },
					{ path: 'membership', model: 'Membership', select: 'user' },
				],
			})
			.populate({
				path: 'classList.quizAttempts',
				populate: {
					path: 'quiz',
					model: 'Quiz',
					select: 'quizTitle quizDescription questions backgroundColor points totalPoints createdAt updatedAt isActive isVisibleToStudent startDate endDate duration',
				},
			})
			.lean({ virtuals: true })
			.exec();

		console.log('Membership: ', userMembership);

		if (!userMembership) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'No memberships found for the user' });
		}

		// The field parameters have to be clearly defined due to the application of the lean() method. Used a spread operator here, but it let in too many JavaScript elements that messed with the mapping function.
		const classGroups = userMembership.classList.map((cl) => ({
			_id: cl.class._id.toString(),
			className: cl.class.className,
			subject: cl.class.subject,
			school: cl.class.school,
			quizAttempts: cl.quizAttempts,
			quizzes: cl.class.quizzes, // Make sure quizzes are included
			membership: cl.class.membership, // Make sure membership is included
		}));

		console.log('Class Groups: ', classGroups);

		// Process each class group to calculate virtual fields
		processClassGroupVirtualsAndCache(classGroups);

		// Cache the newly fetched data
		setCache(cacheKey, classGroups, 3600);

		// Send the classGroups in the response
		res.status(StatusCodes.OK).json({ classGroups });
	} catch (error) {
		console.error('Error in getAllClasses:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
