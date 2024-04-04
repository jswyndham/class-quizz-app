import ClassGroup from '../../models/ClassModel.js';
import Student from '../../models/StudentModel.js';
import Membership from '../../models/MembershipModel.js';
import { StatusCodes } from 'http-status-codes';
import { getCache, setCache } from '../../utils/cache/cache.js';
import hasPermission from '../../utils/hasPermission.js';

function processClassGroupVirtualsAndCache(classGroup, cacheKey) {
	classGroup.quizCount = classGroup.quizzes.length;
	classGroup.memberCount = classGroup.membership.length;

	classGroup.quizzes.forEach((quiz) => {
		quiz.questionCount = quiz.questions.length;
		quiz.totalPoints = quiz.questions.reduce(
			(sum, question) => sum + question.points,
			0
		);
	});

	setCache(cacheKey, classGroup, 3600);
}

// Validate ID format (example using a simple regex for MongoDB ObjectId)
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Controller to retrieve all classes
export const getAllClasses = async (req, res) => {
	try {
		const userId = req.user.userId;
		const userRole = req.user.userStatus;

		// Define a cache key unique to the user
		const cacheKey = `class_${userId}`;

		// Attempt to get cached data
		let cachedData = await getCache(cacheKey);

		// If cache is hit, return the cached data
		if (cachedData) {
			console.log(`Cache hit for key: ${cacheKey}`);
			return res.status(StatusCodes.OK).json({ classGroups: cachedData });
		}

		let classGroups = [];

		// Fetch all class groups created by the user and populate quizzes and membership details
		classGroups = await ClassGroup.find({ createdBy: userId })
			.populate('quizzes')
			.populate({
				path: 'membership',
				populate: { path: 'user', select: 'firstName lastName email' },
			})
			.lean({ virtuals: true })
			.exec();

		// After fetching classGroups from the database, calculate virtual fields
		classGroups.forEach((classGroup) => {
			processClassGroupVirtualsAndCache(
				classGroup,
				`class_${classGroup._id}`
			);
		});

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

// Controller to retrieve a single class
export const getClass = async (req, res) => {
	try {
		const classId = req.params.classId;

		// Validate classId
		if (!isValidObjectId(classId)) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Invalid Class ID format' });
		}

		console.log('CLASS ID: ', classId);
		const cacheKey = `class_${classId}`;

		const cachedData = await getCache(cacheKey);
		if (cachedData) {
			console.log(`Cache hit for key: ${cacheKey}`);
			return res.status(StatusCodes.OK).json({ classGroup: cachedData });
		}

		const classGroup = await ClassGroup.findById(classId)
			.populate({ path: 'quizzes', options: { virtuals: true } })
			.populate({
				path: 'membership',
				populate: {
					path: 'user',
					select: 'firstName lastName email userStatus',
				},
			})
			.lean({ virtuals: true })
			.exec();

		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Class not found' });
		}

		// Processing virtuals and caching
		processClassGroupVirtualsAndCache(classGroup, cacheKey);
		res.status(StatusCodes.OK).json({ classGroup });
	} catch (error) {
		console.error('Error retrieving class:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Error retrieving class',
		});
	}
};

// Controller to find all students in a specific class
export const getClassMemberships = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20; // Number of students per page
		const skip = (page - 1) * limit;
		const classId = req.params.classId;
		const userRole = req.user.userStatus;

		if (!hasPermission(userRole, 'GET_CLASS_MEMBERS')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		// Validate IDs
		if (!isValidObjectId(classId)) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Invalid ID format' });
		}

		try {
			// Create cacheKey
			const cacheKey = `memberships_class_${classId}`;

			console.log('getClassMemberships cacheKey: ', cacheKey);
			// Get previous set cache
			const cachedData = getCache(cacheKey);

			// If the cached data exists, retrieve the existing data.
			if (cachedData) {
				console.log(`Cache hit for key: ${cacheKey}`);
				return res
					.status(StatusCodes.OK)
					.json({ memberships: cachedData });
			} else {
				console.log(`Cache miss for key: ${cacheKey}`);
			}
		} catch (cacheError) {
			console.error('Cache retrieval error:', cacheError);
		}

		try {
			// Count the total number of memberships for this class
			const totalMemberships = await Membership.countDocuments({
				class: classId,
			});

			// Retrieve memberships with pagination and populate necessary fields
			const memberships = await Membership.find({ class: classId })
				.skip(skip)
				.limit(limit)
				.populate({
					path: 'student',
					populate: {
						path: 'user',
						select: 'firstName lastName email',
					},
				})
				.lean()
				.exec();

			const result = {
				memberships,
				total: totalMemberships,
				page,
				pages: Math.ceil(totalMemberships / limit),
			};

			// Set new cache
			setCache(cacheKey, result, 3600); // 1 hour
		} catch (cacheError) {
			console.error('Cache set error:', cacheError);
		}

		res.status(StatusCodes.OK).json(result);
	} catch (error) {
		console.error('Error getting class memberships:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
