import { StatusCodes } from 'http-status-codes';
import Student from '../models/StudentModel';
import { clearCache, getCache, setCache } from '../utils/cache/cache';

// Find and return all students that are members of the student collection (across all classes)
export const getAllStudents = async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10; // Number of students per page
	const skip = (page - 1) * limit;
	const cacheKey = `allStudents_page${page}_limit${limit}`;

	try {
		// Check cache first
		const cachedData = getCache(cacheKey);
		if (cachedData) {
			return res.status(StatusCodes.OK).json(cachedData);
		}

		// Fetch from DB if not cached
		const allStudents = await Student.find({})
			.populate({ path: 'classGroup' })
			.populate({ path: 'user', select: 'firstName lastName email' })
			.skip(skip)
			.limit(limit)
			.exec();

		const total = await Student.countDocuments({
			classGroup: req.params.id,
		});

		if (!allStudents) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'No students found' });
		}

		const result = {
			students: allStudents,
			total,
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
	try {
		// Check cache
		const cachedStudent = getCache(cacheKey);
		if (cachedStudent) {
			return res
				.status(StatusCodes.OK)
				.json({ findStudent: cachedStudent });
		}

		// Fetch from DB if not cached
		const findStudent = await Student.findById(req.user.id)
			.populate({ path: 'classGroup' })
			.populate({ path: 'user', select: 'firstName lastName email' })
			.exec();

		// If no students return
		if (!findStudent) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Student was not found' });
		}

		// Cache the fetched data
		setCache(cacheKey, findStudent, 7200); // Cache for 2 hours

		res.status(StatusCodes.OK).json({ findStudent });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Update student's performance after taking a quiz
export const updateStudentPerformance = async (req, res) => {
	const { score } = req.body;

	try {
		// Find the student document
		const student = await Student.findById(req.body.id);

		if (!student) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Student not found' });
		}

		// Find or initialize performance for the class
		let performance = student.performance.find(
			(p) => p.class.toString() === req.body.id
		);
		if (!performance) {
			performance = {
				class: req.body.id,
				totalScore: 0,
				quizzesTaken: [],
			};
			student.performance.push(performance);
		}

		// Update quizzesTaken and totalScore
		performance.quizzesTaken.push({ quiz: req.body.id, score });
		performance.totalScore += score;

		// Save the student document
		await student.save();

		// Delete related cache
		const cacheKey = `student_${req.body.id}`;
		clearCache(cacheKey);

		res.status(StatusCodes.OK).json({
			message: 'Student performance updated',
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
