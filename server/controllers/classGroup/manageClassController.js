import ClassGroup from '../../models/ClassModel.js';
import Student from '../../models/StudentModel.js';
import Membership from '../../models/MembershipModel.js';
import { StatusCodes } from 'http-status-codes';
import { getCache, setCache, clearCache } from '../../utils/cache/cache.js';
import { ROLE_PERMISSIONS } from '../../utils/constants.js';
import AuditLog from '../../models/AuditLogModel.js';

const hasPermission = (userRole, action) => {
	return (
		ROLE_PERMISSIONS[userRole] &&
		ROLE_PERMISSIONS[userRole].includes(action)
	);
};

// Function to dynamically generate a unique cache key based on user ID and query parameters. This will ensure that users only access the data relevant to their requests.
const generateCacheKey = (userId, queryParams) => {
	const queryStr = JSON.stringify(queryParams);
	return `quizzes_${userId}_${queryStr}`;
};

// Function to generate a unique access code for students to join classes as a member
const generateAccessCode = () => {
	return Math.random().toString(36).slice(2, 11);
};

// Controller to create new class
export const createClass = async (req, res) => {
	const userRole = req.user.userStatus;

	if (!hasPermission(userRole, 'CREATE_CLASS')) {
		return res.status(403).json({
			message: 'Forbidden: You do not have permission for this action',
		});
	}

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

		// Create a membership for the teacher in the newly created class
		const newMembership = await Membership.create({
			user: userId,
			userStatus: USER_STATUS.TEACHER.value,
			classList: [{ class: classGroup._id }],
		});

		// Update the classGroup to include the new membership
		await ClassGroup.findByIdAndUpdate(classGroup._id, {
			$push: { members: newMembership._id },
		});

		// Update the teacher's document to include this class in their classAdministered array
		await Teacher.updateOne(
			{ user: userId },
			{ $push: { classAdministered: classGroup._id } }
		);

		// Create an audit log entry of the user's action
		if (classGroup) {
			const auditLog = new AuditLog({
				action: 'CREATE_CLASS',
				subjectType: 'Class',
				subjectId: classGroup._id,
				userId: req.user.userId,
				details: { reason: 'Class created' },
			});
			await auditLog.save();
		}

		// Clear the cache related to the user's classes
		const classCacheKey = `class_${userId}`;
		clearCache(classCacheKey);

		// Prepare response object
		const response = {
			...classGroup.toObject(), // Convert the document to a plain JavaScript object
			accessCode: undefined, // Remove access code from the response
		};

		// Only include access code in response for site admin or class admin
		if (userRole === 'ADMIN' || userId === classGroup.admin.toString()) {
			response.accessCode = accessCode;
		}

		return res.status(StatusCodes.CREATED).json({ classGroup });
	} catch (error) {
		console.error('Error creating class:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to update a class by ID
export const updateClass = async (req, res) => {
	try {
		// Verify user permissions
		const userRole = req.user.userStatus;
		const userId = req.user.userId;
		const classId = req.params.id;

		if (!hasPermission(userRole, 'UPDATE_CLASS')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const classGroup = await ClassGroup.findById(classId);

		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Class not found' });
		}

		// Check if the current user is the class admin
		if (classGroup.admin.toString() !== userId) {
			return res.status(403).json({
				message:
					'Forbidden: You are not the administrator of this class',
			});
		}

		const updatedClass = await ClassGroup.findByIdAndUpdate(
			classId,
			req.body,
			{ new: true }
		);

		// Create an audit log entry of the user's action
		if (classGroup) {
			const auditLog = new AuditLog({
				action: 'UPDATE_CLASS',
				subjectType: 'Class',
				subjectId: classGroup._id,
				userId: req.user.userId,
				details: { reason: 'Class updated' },
			});
			await auditLog.save();
		}

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
		// Verify user permissions
		const userRole = req.user.userStatus;
		const userId = req.user.userId;
		const classId = req.params.id;

		if (!hasPermission(userRole, 'DELETE_CLASS')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const classGroup = await ClassGroup.findById(classId);

		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Class not found' });
		}

		// Check if the current user is the class admin
		if (classGroup.admin.toString() !== userId) {
			return res.status(403).json({
				message:
					'Forbidden: You are not the administrator of this class',
			});
		}

		// Update memberships related to this class
		await Membership.updateMany(
			{ 'classList.class': classId },
			{ $pull: { classList: { class: classId } } }
		);

		// Delete the class group by ID
		const removedClass = await ClassGroup.findByIdAndDelete(classId);

		// Create an audit log entry of the user's action
		if (classGroup) {
			const auditLog = new AuditLog({
				action: 'DELETE_CLASS',
				subjectType: 'Class',
				subjectId: classGroup._id,
				userId: req.user.userId,
				details: { reason: 'Class deleted' },
			});
			await auditLog.save();
		}

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

// Controller to allow students to join a class with an access code
export const joinClassWithCode = async (req, res) => {
	const { accessCode } = req.body;
	const studentId = req.user.userId;
	const userRole = req.user.userStatus;

	if (!hasPermission(userRole, 'JOIN_CLASS')) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ msg: 'Unauthorized' });
	}

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

// TODO: Might have to delete this function as it might be a duplicate function (studentController). Need further testing...
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
