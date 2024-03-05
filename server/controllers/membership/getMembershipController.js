import Membership from '../../models/MembershipModel.js';
import { getCache, setCache } from '../../utils/cache/cache.js';
import hasPermission from '../../utils/hasPermission.js';
import { StatusCodes } from 'http-status-codes';

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
				path: 'classList',
				populate: { path: 'class', select: 'className subject school' }, // Populating quizzes for each class
			})
			.populate({
				path: 'classList.quizAttempts',
				populate: {
					path: 'quiz',
					select: 'quizTitle questions backgroundColor totalPoints createdAt updatedAt isActive isVisibleBeforeStart availableFrom availableUntil duration',
				}, // Populating the quiz details in quizAttempts
			})
			.lean()
			.exec();

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
		}));

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
