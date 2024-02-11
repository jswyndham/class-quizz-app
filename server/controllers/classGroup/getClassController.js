import ClassGroup from '../../models/ClassModel.js';
import Student from '../../models/StudentModel.js';
import Membership from '../../models/MembershipModel.js';
import { StatusCodes } from 'http-status-codes';
import { getCache, setCache } from '../../utils/cache/cache.js';
import { ROLE_PERMISSIONS } from '../../utils/constants.js';

const hasPermission = (userRole, action) => {
	return (
		ROLE_PERMISSIONS[userRole] &&
		ROLE_PERMISSIONS[userRole].includes(action)
	);
};

// Validate ID format (example using a simple regex for MongoDB ObjectId)
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Controller to retrieve all classes
export const getAllClasses = async (req, res) => {
	const userId = req.user.userId;
	// Setting the cacheKey parameters
	const cacheKey = `class_${userId}`;

	try {
		const cachedData = getCache(cacheKey);

		// If the cached data exists, retrieve the existing data.
		if (cachedData) {
			console.log(`Cache hit for key: ${cacheKey}`);

			return res.status(StatusCodes.OK).json({ classGroups: cachedData });
		} else {
			console.log(`Cache miss for key: ${cacheKey}`);
			// Find all classes organized by createdBy user

			const classGroups = await ClassGroup.find({
				createdBy: userId,
			})
				.populate({ path: 'quizzes', options: { virtuals: true } })
				.lean({ virtuals: true })
				.exec();

			// Manually add virtual fields to each quiz in classGroups. This has to be done here because the virtual fields are calaulated properties and not actual parts of the Mongoose schema.
			classGroups.forEach((classGroup) => {
				classGroup.quizzes.forEach((quiz) => {
					quiz.questionCount = quiz.questions.length;
					quiz.totalPoints = quiz.questions.reduce(
						(sum, question) => sum + question.points,
						0
					);
				});
			});

			// Set data cache
			setCache(cacheKey, classGroups, 3600); // 1 hour

			res.status(StatusCodes.OK).json({ classGroups });
		}
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
		// Convert query parameters to a string for the cache key
		const classId = req.params.id;
		const userId = req.user.userId;

		// Unique cacheKey
		const cacheKey = `class_${userId}_${classId}`;

		// Validate IDs
		if (!isValidObjectId(classId) || !isValidObjectId(userId)) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: 'Invalid ID format' });
		}

		const cachedClass = await getCache(cacheKey);
		if (cachedClass) {
			console.log(`Cache hit for key: ${cacheKey}`);
			console.log('Cache hit class: ', { classGroup: cachedClass });
			return res.status(StatusCodes.OK).json({ classGroup: cachedClass });
		} else {
			console.log(`Cache miss for key: ${cacheKey}`);
			console.log('Cache miss class: ', cachedClass);
			const classGroup = await ClassGroup.findById(classId)
				.populate('quizzes') // Populate quizzes mongoose ref
				.populate('students') // Populate students mongoose ref
				.lean({ virtuals: true })
				.exec();

			if (!classGroup) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: 'Class not found' });
			}

			// Manually add virtual fields to each quiz in classGroups. This has to be done here because the virtual fields are calaulated properties and not part of the Mongoose schema.
			classGroup.quizzes.forEach((quiz) => {
				quiz.questionCount = quiz.questions.length;
				quiz.totalPoints = quiz.questions.reduce(
					(sum, question) => sum + question.points,
					0
				);
			});

			// Cache the class data
			setCache(cacheKey, classGroup, 3600); // Caching for 1 hour

			res.status(StatusCodes.OK).json({ classGroup });
		}
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to find all students in a specific class
export const getClassMemberships = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20; // Number of students per page
		const skip = (page - 1) * limit;
		const classId = req.params.id;
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
