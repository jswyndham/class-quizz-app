import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import ClassGroup from '../models/ClassModel.js';
import { getCache, setCache } from '../utils/cache/cache.js';

// Controller to get the current user
export const getCurrentUser = async (req, res) => {
	try {
		const cacheKey = `user_${req.user.userId}`;
		let userData = getCache(cacheKey);

		console.log(`Cache miss for allQuizzes key: ${cacheKey}`);

		if (!userData) {
			const user = await User.findById(req.user.userId);
			if (!user) throw new Error('User not found');

			// Create clone of the user object and remove password (sanitizing user data)
			userData = user.toObject();
			delete userData.password;

			// Update cache for new user object
			setCache(cacheKey, userData, 3600); // Cache for 1 hour
		}

		res.status(StatusCodes.OK).json({ user: userData });
	} catch (error) {
		console.error('Error finding current user:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to update the current user
export const updateUser = async (req, res) => {
	try {
		const obj = { ...req.body };
		delete obj.password; // Exclude password in update

		const updatedUser = await User.findByIdAndUpdate(req.user.userId, obj, {
			new: true,
		});

		// Update cache with new user data
		const cacheKey = `user_${req.user.userId}`;
		setCache(cacheKey, updatedUser.toObject(), 3600);

		res.status(StatusCodes.OK).json({ update: updatedUser });
	} catch (error) {
		console.error('Error updating user:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to get application statistics
export const getApplicationStats = async (req, res) => {
	try {
		const cacheKey = 'app_stats';
		let stats = getCache(cacheKey);

		if (!stats) {
			const users = await User.countDocuments();
			const classGroup = await ClassGroup.countDocuments();
			const quizzes = await Quiz.countDocuments();

			stats = { users, classGroup, quizzes };

			// Set data in cache
			setCache(cacheKey, stats, 86400); // Cache for 1 day
		}

		res.status(StatusCodes.OK).json(stats);
	} catch (error) {
		console.error('Error finding application stats:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
