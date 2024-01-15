import ClassGroup from '../models/ClassModel.js';
import Student from '../models/StudentModel.js';
import { StatusCodes } from 'http-status-codes';
import { getCache, setCache } from '../utils/cache/cache.js';

// Function to dynamically generate a unique cache key based on user ID and query parameters.
// This will ensure that users only access the data relevant to their requests.
const generateCacheKey = (userId, queryParams) => {
	const queryStr = JSON.stringify(queryParams);
	return `class_${userId}_${queryStr}`;
};

// Controller to retrieve all classes
export const getAllClasses = async (req, res) => {
	// Setting the cacheKey parameters
	const cacheKey = generateCacheKey(req.user.userId, req.query);

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
				.lean()
				.exec();

			// Set data in cache for future requests
			setCache(cacheKey, classGroups, 10800); // Caches for 3 hours

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
		// Set the user as the creator of the class
		req.body.createdBy = req.user.userId;
		const classGroup = await ClassGroup.create(req.body);

		// Invalidate cache after creating a new class
		const cacheKey = `allClasses_${req.user.userId}`;
		clearCache(cacheKey);

		return res.status(StatusCodes.CREATED).json({ classGroup });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to retrieve a single class
export const getClass = async (req, res) => {
	const classId = req.params.id;
	const cacheKey = `class_${classId}`;

	console.log('CLASS ID: ', classId);

	try {
		const cachedClass = getCache(cacheKey);
		if (cachedClass) {
			console.log(`Cache hit for key: ${cacheKey}`);
			return res.status(StatusCodes.OK).json({ classGroup: cachedClass });
		} else {
			console.log(`Cache miss for key: ${cacheKey}`);
			const classGroup = await ClassGroup.findById(classId)
				.populate('quizzes') // Populate quizzes
				.populate('students') // Populate students
				.lean()
				.exec();
			if (!classGroup) {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ message: 'Class not found' });
			}

			// Cache the retrieved class data
			setCache(cacheKey, classGroup, 10800); // Caching for 3 hours

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
		const updatedClass = await ClassGroup.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			}
		);

		// Invalidate cache when updating a class
		const cacheKey = `allClasses_${req.user.userId}`;
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
		// Delete the class group by ID
		const removedClass = await ClassGroup.findByIdAndDelete(req.params.id);

		// Invalidate cache when deleting a class
		const cacheKey = `allClasses_${req.user.userId}`;
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
			setCache(cacheKey, students, 10800); // Caches for 3 hours

			const students = classGroup.students; // Assuming 'students' is an array of student IDs
			res.status(StatusCodes.OK).json({ students });
		}
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
