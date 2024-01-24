import ClassGroup from '../models/ClassModel.js';
import Student from '../models/StudentModel.js';
import { StatusCodes } from 'http-status-codes';
import { getCache, setCache, clearCache } from '../utils/cache/cache.js';

// Function to dynamically generate a unique cache key based on user ID and query parameters. This will ensure that users only access the data relevant to their requests.
const generateCacheKey = (userId, queryParams) => {
	const queryStr = JSON.stringify(queryParams);
	return `quizzes_${userId}_${queryStr}`;
};

// Function to generate a unique access code for students to join classes as a member
const generateAccessCode = () => {
	return Math.random().toString(36).slice(2, 11);
};

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
				createdBy: req.user.userId,
			})
				.populate({ path: 'quizzes' })
				.lean({ virtuals: true })
				.exec();

			// Set data in cache for future requests
			setCache(cacheKey, classGroups, 3600); // Caches for 1 hour

			res.status(StatusCodes.OK).json({ classGroups });
		}
	} catch (error) {
		console.error('Error in getAllClasses:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to create new class
export const createClass = async (req, res) => {
	try {
		const userId = req.user.userId;

		// Generate a unique access code for the new class
		const accessCode = generateAccessCode();

		// Create a new class with the provided data and the generated access code
		const classGroup = await ClassGroup.create({
			...req.body,
			createdBy: userId,
			accessCode: accessCode,
		});

		// Clear the cache related to the user's classes
		const classCacheKey = `class_${userId}`;
		clearCache(classCacheKey);

		return res.status(StatusCodes.CREATED).json({ classGroup });
	} catch (error) {
		console.error('Error creating class:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to retrieve a single class
export const getClass = async (req, res) => {
	// Convert query parameters to a string for the cache key
	const classId = req.params.id;
	const userId = req.user.userId;
	const cacheKey = `class_${userId}_${classId}`; // Unlike getAllClasses function, this also has classId to create a unique key for each class object.

	try {
		const cachedClass = await getCache(cacheKey);
		if (cachedClass) {
			console.log(`Cache hit for key: ${cacheKey}`);
			return res.status(StatusCodes.OK).json({ classGroup: cachedClass });
		} else {
			console.log(`Cache miss for key: ${cacheKey}`);
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

			// Cache the retrieved class data
			setCache(cacheKey, classGroup, 3600); // Caching for 1 hour

			res.status(StatusCodes.OK).json({ classGroup });
		}
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to update a class by ID
export const updateClass = async (req, res) => {
	try {
		const userId = req.user.userId;
		const cacheKey = `class_${userId}`;

		const updatedClass = await ClassGroup.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			}
		);

		// Clear the cache when updated
		clearCache(cacheKey);

		res.status(StatusCodes.OK).json({
			msg: 'Class was updated',
			class: updatedClass,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to delete class by ID
export const deleteClass = async (req, res) => {
	try {
		const userId = req.user.userId;
		const cacheKey = `class_${userId}`;

		// Delete the class group by ID
		const removedClass = await ClassGroup.findByIdAndDelete(req.params.id);

		// Clear the cache related to the user's classes
		clearCache(cacheKey);

		res.status(StatusCodes.OK).json({
			msg: 'Class was deleted',
			class: removedClass,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// A controller to allow students to join a class.
export const joinClass = async (req, res) => {
	const classId = req.params.id;
	const userId = req.user.userId;

	try {
		// Add student to the class
		const updatedClass = await ClassGroup.findByIdAndUpdate(
			classId,
			// The $addToSet operator is used to add a value to an array only if the value does not already exist in the array.
			{ $addToSet: { students: userId } },
			{ new: true }
		);

		if (!updatedClass) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Class not found' });
		}

		// Invalidate cache when joining a new student member to a class
		const cacheKey = `allClasses_${req.user.userId}`;
		clearCache(cacheKey);

		res.status(StatusCodes.OK).json({ msg: 'Joined class successfully' });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Get all members of a class group
export const getAllStudents = async (req, res) => {
	// Setting the cacheKey parameters
	const cacheKey = generateCacheKey(req.user.userId, req.query);

	try {
		// Checking the cache
		const cachedData = getCache(cacheKey);

		// If the cached data exists, retrieve the existing data.
		if (cachedData) {
			console.log(`Cache hit for key: ${cacheKey}`);
			return res.status(StatusCodes.OK).json({ students: cachedData });
		} else {
			console.log(`Cache miss for key: ${cacheKey}`);

			// Find all classes organized by createdBy user
			const classGroup = await ClassGroup.findById(req.params.id)
				.populate('students')
				.exec();
			if (!classGroup) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: 'Class not found' });
			}

			// Set data in cache for future requests
			setCache(cacheKey, students, 3600); // Caches for 1 hour

			const students = classGroup.students; // Assuming 'students' is an array of student IDs
			res.status(StatusCodes.OK).json({ students });
		}
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to allow students to join a class with an access code
export const joinClassWithCode = async (req, res) => {
	const { accessCode } = req.body;
	const studentId = req.user.userId;

	try {
		// Get class details from cache
		const cacheKey = `class_${accessCode}`;
		let classGroup = getCache(cacheKey);

		// Fetch from DB if not in cache
		if (!classGroup) {
			classGroup = await ClassGroup.findOne({ accessCode: accessCode });
			if (!classGroup) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: 'Class not found' });
			}
		}

		// Update class only if student is not already a member
		if (!classGroup.students.includes(studentId)) {
			classGroup.students.push(studentId);
			await classGroup.save();

			// Update the cache
			setCache(cacheKey, classGroup, 10800); // Adjust TTL as needed
		}

		res.status(StatusCodes.OK).json({
			message: 'Joined class successfully',
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
