import { StatusCodes } from 'http-status-codes';
import { getCache, setCache } from '../utils/cache/cache.js';
import Teacher from '../models/TeacherModel.js';

const hasPermission = (userRole, action) => {
	return (
		ROLE_PERMISSIONS[userRole] &&
		ROLE_PERMISSIONS[userRole].includes(action)
	);
};

// Find and return all teachers that are members of the teacher collection (across all classes)
export const getAllTeachers = async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 20; // Number of teachers per page
	const skip = (page - 1) * limit;
	const cacheKey = `allTeachers_page${page}_limit${limit}`;

	if (!hasPermission(userRole, 'GET_ALL_TEACHERS')) {
		return res.status(403).json({
			message: 'Forbidden: You do not have permission for this action',
		});
	}

	try {
		// Check cache first
		const cachedData = getCache(cacheKey);
		if (cachedData) {
			return res.status(StatusCodes.OK).json(cachedData);
		}

		// Fetch from DB if not cached
		const allTeachers = await Teacher.find({})
			.populate({ path: 'user', select: 'firstName lastName email' })
			.select('siteMemberStatus')
			.skip(skip)
			.limit(limit)
			.exec();

		// Calculate total number of teachers across all classes
		const totalTeachers = await Teacher.countDocuments();

		if (!allTeachers) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'No teachers found' });
		}

		const result = {
			teachers: allTeachers,
			total: totalTeachers,
			page,
			pages: Math.ceil(totalTeachers / limit), // Calculates the total number of pages required to display all students
		};

		// Cache the fetched data
		setCache(cacheKey, result, 7200); // Cache for 2 hours

		res.status(StatusCodes.OK).json(result);
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Find a teacher by id
export const getSingleTeacher = async (req, res) => {
	const teacherId = req.params.teacherId;
	const userId = req.user._id; // ID of the authenticated user
	const cacheKey = `teacher_${teacherId}`;

	if (!hasPermission(userRole, 'GET_SINGLE_TEACHER')) {
		return res.status(403).json({
			message: 'Forbidden: You do not have permission for this action',
		});
	}

	// Check if the authenticated user is the same as the requested teacher
	if (userId.toString() !== teacherId) {
		return res.status(403).json({
			message:
				'Forbidden: You do not have permission to access this data',
		});
	}

	try {
		// Check cache
		const cachedTeacher = getCache(cacheKey);
		if (cachedTeacher) {
			return res
				.status(StatusCodes.OK)
				.json({ findTeacher: cachedTeacher });
		}

		// Fetch from DB if not cached
		const teacher = await Teacher.findById(teacherId)
			.populate({
				path: 'user',
				select: 'firstName lastName email',
			})
			.populate({
				path: 'classAdministered.class',
				select: 'className subject school quizzes',
				populate: {
					path: 'quizzes',
					select: 'quizTitle',
				},
			})
			.populate({
				path: 'classMembership.classList',
				populate: { path: 'class', select: 'className' },
				select: 'joinedAt',
			})
			.select('siteMemberStatus')
			.lean()
			.exec();

		// If no teachers return
		if (!teacher) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Teacher was not found' });
		}

		// Cache the fetched data
		setCache(cacheKey, teacher, 3600); // Cache for 1 hour

		res.status(StatusCodes.OK).json({ teacher });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
