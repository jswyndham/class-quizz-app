import { StatusCodes } from 'http-status-codes';
import Student from '../../models/StudentModel.js';
import { getCache, setCache } from '../../utils/cache/cache.js';

const hasPermission = (userRole, action) => {
	return (
		ROLE_PERMISSIONS[userRole] &&
		ROLE_PERMISSIONS[userRole].includes(action)
	);
};

// Find and return all students that are members of the student collection (across all classes)
export const getAllStudents = async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 20; // Number of students per page
	const skip = (page - 1) * limit;
	const cacheKey = `allStudents_page${page}_limit${limit}`;

	// User permissions
	const userRole = req.user.userStatus;
	if (!hasPermission(userRole, 'GET_ALL_STUDENTS')) {
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
		const allStudents = await Student.find({})
			.populate({ path: 'user', select: 'firstName lastName email' })
			.skip(skip)
			.limit(limit)
			.exec();

		// Calculate total number of students across all classes
		const totalStudents = await Student.countDocuments();

		if (!allStudents) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'No students found' });
		}

		const result = {
			students: allStudents,
			total: totalStudents,
			page,
			pages: Math.ceil(total / limit), // Calculates the total number of pages required to display all students
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

// Find a student by id
export const getSingleStudent = async (req, res) => {
	const studentId = req.params.studentId;
	const cacheKey = `student_${studentId}`;

	// User permissions
	const userRole = req.user.userStatus;
	if (!hasPermission(userRole, 'GET_SINGLE_STUDENT')) {
		return res.status(403).json({
			message: 'Forbidden: You do not have permission for this action',
		});
	}

	try {
		// Check cache
		const cachedStudent = getCache(cacheKey);
		if (cachedStudent) {
			return res
				.status(StatusCodes.OK)
				.json({ findStudent: cachedStudent });
		}

		// Fetch from DB if not cached
		const student = await Student.findById(req.user.id)
			.populate({ path: 'user', select: 'firstName lastName email' })
			.populate({
				path: 'classMembership',
				populate: {
					path: 'classList',
					populate: { path: 'class', select: 'className' },
					select: 'joinedAt',
				},
			})
			.populate({
				path: 'performance',
				populate: {
					path: 'class',
					populate: { path: 'class', select: 'className' },
					populate: {
						path: 'quizzesTaken',
						populate: {
							path: 'quiz',
							select: 'quiz score completed isFullyScored isVisibleToStudent',
						},
					},
				},
			})
			.lean()
			.exec();

		// If no students return
		if (!student) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Student was not found' });
		}

		// Cache the fetched data
		setCache(cacheKey, student, 3600); // Cache for 1 hour

		res.status(StatusCodes.OK).json({ student });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
