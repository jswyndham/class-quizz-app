import User from '../../models/UserModel.js';
import Membership from '../../models/MembershipModel.js';
import { getCache, setCache } from '../../utils/cache/cache.js';
import hasPermission from '../../utils/hasPermission.js';
import { StatusCodes } from 'http-status-codes';

// Get (find) all the class memberships a single student has joined
export const getStudentMemberships = async (req, res) => {
	try {
		const userRole = req.user.userStatus;
		const userId = req.params.userId; // Using userId instead of studentId

		if (!hasPermission(userRole, 'GET_ALL_STUDENT_MEMBERSHIPS')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const cacheKey = `memberships_user_${userId}`;

		// Try to retrieve from cache first
		const cachedData = await getCache(cacheKey);
		if (cachedData) {
			return res.status(StatusCodes.OK).json({ memberships: cachedData });
		}

		// Query the User model for membership data
		const userData = await User.findById(userId)
			.select('membership')
			.populate({
				path: 'membership',
				populate: {
					path: 'classList.class',
					model: 'Class',
					select: 'className subject school',
				},
			})
			.lean();

		if (!userData) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'User not found' });
		}

		// Cache the retrieved data
		await setCache(cacheKey, userData.membership, 3600); // Cache for 1 hour

		res.status(StatusCodes.OK).json({ memberships: userData.membership });
	} catch (error) {
		console.error('Error getting user memberships:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Get (find) a single user's membership details
export const getUserMembership = async (req, res) => {
	try {
		const userRole = req.user.userStatus;
		const userId = req.params.userId;
		const membershipId = req.params.membershipId;

		if (!hasPermission(userRole, 'GET_USER_MEMBERSHIP')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const cacheKey = `membership_user_${userId}_${membershipId}`;

		// Try to retrieve from cache first
		const cachedMembership = await getCache(cacheKey);
		if (cachedMembership) {
			return res
				.status(StatusCodes.OK)
				.json({ membership: cachedMembership });
		}

		// Query the Membership model
		const membershipData = await Membership.findOne({
			_id: membershipId,
			user: userId,
		})
			.populate({
				path: 'classList.class',
				model: 'Class',
				select: 'className subject school',
			})
			.lean();

		if (!membershipData) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Membership not found' });
		}

		// Cache the retrieved data
		await setCache(cacheKey, membershipData, 3600); // Cache for 1 hour

		res.status(StatusCodes.OK).json({ membership: membershipData });
	} catch (error) {
		console.error('Error getting user membership:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
