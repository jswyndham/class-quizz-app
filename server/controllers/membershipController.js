import ClassGroup from '../models/ClassModel.js';
import AuditLog from '../models/AuditLogModel.js';
import Membership from '../models/MembershipModel.js';
import { isValidObjectId } from 'mongoose';
import { getCache, setCache, clearCache } from '../utils/cache/cache.js';
import { ROLE_PERMISSIONS } from '../utils/constants.js';
import { StatusCodes } from 'http-status-codes';
import Student from '../models/StudentModel.js';

const hasPermission = (userRole, action) => {
	return (
		ROLE_PERMISSIONS[userRole] &&
		ROLE_PERMISSIONS[userRole].includes(action)
	);
};

// Create student class membership (student join class)
export const createMembership = async (req, res) => {
	try {
		const userRole = req.user.userStatus;
		const studentId = req.user.userId;
		const accessCode = req.body.accessCode;

		if (!hasPermission(userRole, 'JOIN_CLASS')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		// Fetch the class by accessCode
		const classGroup = await ClassGroup.findOne({ accessCode: accessCode });
		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Class not found with provided access code' });
		}

		// Check if the student already joined the class
		const existingMembership = await Membership.findOne({
			student: studentId,
			class: classGroup._id,
		});
		if (existingMembership) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ msg: 'Student already joined the class' });
		}

		// Create new membership
		const membership = await Membership.findOneAndUpdate(
			{ student: studentId },
			{ $push: { classList: { class: classId } } },
			{ new: true }
		);

		// Add membership to the class
		classGroup.membership.push(membership._id);
		await classGroup.save();

		// Also update the Student's membership array
		await Student.findOneAndUpdate(
			{ user: studentId },
			{ $push: { membership: membership._id } }
		);

		// Create an audit log entry of the user's action
		const auditLog = new AuditLog({
			action: 'CREATE_MEMBERSHIP',
			subjectType: 'Class membership',
			subjectId: membership._id,
			userId: req.user.userId,
			details: { reason: 'Class member added' },
		});
		await auditLog.save();

		// Clear related caches
		clearCache(`memberships_student_${studentId}`);
		clearCache(`memberships_class_${classGroup._id}`);

		res.status(StatusCodes.CREATED).json({ membership });
	} catch (error) {
		console.error('Error creating membership:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Get (find) all the class memberships a single student has joined
export const getStudentMemberships = async (req, res) => {
	try {
		const userRole = req.user.userStatus;
		const studentId = req.params.studentId;

		console.log('Requested studentId:', studentId);

		if (!hasPermission(userRole, 'GET_ALL_STUDENT_MEMBERSHIPS')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const cacheKey = `memberships_student_${studentId}`;
		try {
			const cachedData = getCache(cacheKey);
			if (cachedData) {
				return res
					.status(StatusCodes.OK)
					.json({ memberships: cachedData });
			}
		} catch (cacheError) {
			console.error('Cache retrieval error:', cacheError);
		}

		// Query the Student model by the user field
		const studentData = await Student.findOne({ user: studentId })
			.select('membership')
			.populate({
				path: 'user',
				select: 'firstName lastName email',
			})
			.lean()
			.exec();

		if (!studentData) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Student not found' });
		}

		try {
			setCache(cacheKey, studentData.membership, 3600); // Cache for 1 hour
		} catch (cacheError) {
			console.error('Cache set error:', cacheError);
		}

		res.status(StatusCodes.OK).json({
			memberships: studentData.membership,
		});
	} catch (error) {
		console.error('Error getting student memberships:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Delete (remove) a student from class membership
export const deleteMembership = async (req, res) => {
	try {
		const userRole = req.user.userStatus;

		const userId = req.params.userId;
		const classId = req.params.classId;

		console.log('USER ID: ', userId);
		console.log('CLASS ID: ', classId);

		if (!hasPermission(userRole, 'DELETE_CLASS_MEMBERSHIP')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		// Update the Membership document by removing the class from classList
		const updatedMembership = await Membership.findOneAndUpdate(
			{ student: userId },
			{ $pull: { classList: { class: classId } } },
			{ new: true }
		);

		if (!updatedMembership) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Membership not found' });
		}

		// Update the Student model
		await Student.updateOne(
			{ _id: userId },
			{ $pull: { membership: updatedMembership._id } }
		);

		// Update the Class model
		await ClassGroup.updateOne(
			{ _id: classId },
			{ $pull: { membership: updatedMembership._id } }
		);

		// Clear related caches
		clearCache(`memberships_student_${userId}`);
		clearCache(`memberships_class_${classId}`);

		res.status(StatusCodes.OK).json({
			msg: 'Class removed from membership',
			updatedMembership,
		});
	} catch (error) {
		console.error('Error updating membership:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
