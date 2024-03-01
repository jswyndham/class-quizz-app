import Membership from '../../models/MembershipModel.js';
import { getCache, setCache } from '../../utils/cache/cache.js';
import hasPermission from '../../utils/hasPermission.js';
import { StatusCodes } from 'http-status-codes';

// Get (find) all the class memberships a single student has joined
export const getAllMemberships = async (req, res) => {
	try {
		const userId = req.user.userId;
		const userRole = req.user.userStatus;

		console.log('USER ID: ', userId);

		// Define a cache key unique to the user
		const cacheKey = `membership_${userId}`;

		// Attempt to get cached data
		let cachedData = await getCache(cacheKey);

		// If cache is hit, return the cached data
		if (cachedData) {
			console.log(`Cache hit for key: ${cacheKey}`);
			return res.status(StatusCodes.OK).json({ classGroups: cachedData });
		}

		let classGroups = [];

		// Fetch all memberships for the user and populate class details and quizAttempts
		const memberships = await Membership.find()
			.populate({
				path: 'classList',
				populate: { path: 'class' }, // Populating quizzes for each class
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

		// Transform the data to have class details along with corresponding quizAttempts
		classGroups = memberships.flatMap((m) =>
			m.classList.map((cl) => ({
				...cl.class, // Spread the class details
				quizAttempts: cl.quizAttempts, // Include quizAttempts
			}))
		);

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
