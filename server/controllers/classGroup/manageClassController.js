import ClassGroup from '../../models/ClassModel.js';
import Student from '../../models/StudentModel.js';
import Membership from '../../models/MembershipModel.js';
import { StatusCodes } from 'http-status-codes';
import { clearCache } from '../../utils/cache/cache.js';
import AuditLog from '../../models/AuditLogModel.js';
import hasPermission from '../../utils/hasPermission.js';
import { USER_STATUS } from '../../utils/constants.js';
import Teacher from '../../models/TeacherModel.js';

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

	const { className, subject, school } = req.body;

	if (!hasPermission(userRole, 'CREATE_CLASS')) {
		return res.status(StatusCodes.FORBIDDEN).json({
			message: 'Forbidden: You do not have permission for this action',
		});
	}

	try {
		const userId = req.user.userId;
		const { className, subject, school, dayOfTheWeek, classTime } =
			req.body;

		// Validate request body
		if (
			!className ||
			!subject ||
			!school ||
			!dayOfTheWeek ||
			!classTime.start ||
			!classTime.end
		) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Missing required fields',
			});
		}

		// Check for existing class name
		const existingClass = await ClassGroup.findOne({ className });
		if (existingClass) {
			return res.status(StatusCodes.CONFLICT).json({
				message: 'Class name already exists',
			});
		}

		// Generate a unique access code for the new class
		const accessCode = generateAccessCode();

		// Create a new class with the provided data and the generated access code
		const classGroup = await ClassGroup.create({
			className,
			subject,
			school,
			dayOfTheWeek,
			classTime,
			createdBy: userId,
			classAdmin: userId, // Set the class creator as the admin
			accessCode: accessCode, // Set the unique class access code
		});

		// Update or create the user's membership
		const membership = await Membership.findOneAndUpdate(
			{ user: userId },
			{ $addToSet: { classList: { class: classGroup._id } } },
			{ new: true, upsert: true }
		);

		// Add membership to the class group
		await ClassGroup.findByIdAndUpdate(classGroup._id, {
			$addToSet: { membership: membership._id },
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
		const cacheKey = `class_${userId}`;
		clearCache(cacheKey);

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
		const classId = req.params.classId;

		if (!hasPermission(userRole, 'UPDATE_CLASS')) {
			return res.status(StatusCodes.FORBIDDEN).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const classGroup = await ClassGroup.findById(classId);

		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Class not found' });
		}

		// Check if the current user is the class admin
		if (classGroup.classAdmin.toString() !== userId) {
			return res.status(StatusCodes.FORBIDDEN).json({
				message:
					'Forbidden: You are not the administrator of this class',
			});
		}

		// Check for existing class name conflict (if className is being updated)
		if (req.body.className) {
			const existingClass = await ClassGroup.findOne({
				className: req.body.className,
				_id: { $ne: classId },
			});
			if (existingClass) {
				return res.status(StatusCodes.CONFLICT).json({
					message: 'Class name already exists',
				});
			}
		}

		// Prepare update object
		const updateData = { ...req.body };

		console.log('Update Class: ', updateData);

		// Update class times if provided
		if (req.body.dayOfTheWeek)
			updateData.dayOfTheWeek = req.body.dayOfTheWeek;
		if (req.body.classTime) updateData.classTime = req.body.classTime;

		const updatedClass = await ClassGroup.findByIdAndUpdate(
			classId,
			updateData,
			{ new: true }
		);

		console.log('Updated Class data: ', updatedClass);

		// Create an audit log entry of the user's action
		// [Assuming AuditLog is a model for logging actions]
		const auditLog = new AuditLog({
			action: 'UPDATE_CLASS',
			subjectType: 'Class',
			subjectId: classGroup._id,
			userId: userId,
			details: { reason: 'Class updated' },
		});
		await auditLog.save();

		// Clear the cache when updated
		// [Assuming clearCache is a function to clear cache]
		const cacheKey = `class_${userId}`;
		clearCache(cacheKey);

		res.status(StatusCodes.OK).json({
			message: 'Class was updated',
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
		const classId = req.params.classId;

		if (!hasPermission(userRole, 'DELETE_CLASS')) {
			return res.status(StatusCodes.FORBIDDEN).json({
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
			return res.status(StatusCodes.FORBIDDEN).json({
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
		const cacheKey = `class_${userId}`;
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
