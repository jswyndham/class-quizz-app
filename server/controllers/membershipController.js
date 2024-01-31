import ClassGroup from '../models/ClassModel.js';
import AuditLog from '../models/AuditLogModel.js';
import Membership from '../models/MembershipModel';
import { isValidObjectId } from 'mongoose';
import { getCache, setCache, clearCache } from '../utils/cache/cache.js';
import { ROLE_PERMISSIONS } from '../utils/constants.js';

const hasPermission = (userRole, action) => {
	return (
		ROLE_PERMISSIONS[userRole] &&
		ROLE_PERMISSIONS[userRole].includes(action)
	);
};

// Create student class membership (student join class)
export const createMembership = async (req, res) => {
	try {
		// Verify user permissions
		const userRole = req.user.userStatus;

		if (!hasPermission(userRole, 'JOIN_CLASS')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const { studentId, classId, accessCode } = req.body;

		// Check class and student id for validity
		if (!isValidObjectId(studentId) || !isValidObjectId(classId)) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ msg: 'Invalid student or class ID' });
		}

		// Fetch the class by ID
		const classGroup = await ClassGroup.findById(classId);
		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Class not found' });
		}

		// Check if the provided access code matches the class's access code
		if (classGroup.accessCode !== accessCode) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ msg: 'Invalid access code' });
		}

		// Check if the student already joined the class
		const existingMembership = await Membership.findOne({
			student: studentId,
			class: classId,
		});
		if (existingMembership) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ msg: 'Student already joined the class' });
		}

		// Create new membership
		const membership = await Membership.create({
			student: studentId,
			class: classId,
		});

		// Create an audit log entry of the user's action
		if (membership) {
			const auditLog = new AuditLog({
				action: 'CREATE_MEMBERSHIP',
				subjectType: 'Class membership',
				subjectId: membership._id,
				userId: req.user.userId,
				details: { reason: 'Class member added' },
			});
			await auditLog.save();
		}

		// student cache
		const studentCacheKey = `student_${studentId}`;
		// cache for class
		const classCacheKey = `class_${classId}`;
		// membership cache
		const allMembershipsCacheKey = `memberships_class_${classId}`;

		clearCache(allMembershipsCacheKey);
		clearCache(studentCacheKey);
		clearCache(classCacheKey);

		res.status(StatusCodes.CREATED).json({ membership });
	} catch (error) {
		console.error('Error creating membership:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Get all students in a specific class
export const getClassMemberships = async (req, res) => {
	try {
		// Verify user permissions
		const userRole = req.user.userStatus;

		if (!hasPermission(userRole, 'GET_CLASS_MEMBERS')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const classId = req.params.id;

		// Create cacheKey
		const cacheKey = `memberships_class_${classId}`;

		console.log('getClassMemberships cacheKey: ', cacheKey);

		try {
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

		const memberships = await Membership.find({ class: classId })
			.populate('student')
			.lean()
			.exec();

		try {
			// Set new cache
			setCache(cacheKey, memberships, 3600); // 1 hour
		} catch (cacheError) {
			console.error('Cache set error:', cacheError);
		}

		res.status(StatusCodes.OK).json({ memberships });
	} catch (error) {
		console.error('Error getting class memberships:', error);
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

		const memberships = await Membership.find({ student: studentId })
			.populate('class')
			.lean()
			.exec();

		try {
			setCache(cacheKey, memberships, 3600); // 1 hour
		} catch (cacheError) {
			console.error('Cache set error:', cacheError);
		}

		res.status(StatusCodes.OK).json({ memberships });
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
		const { studentId, classId } = req.body;

		if (!hasPermission(userRole, 'DELETE_CLASS_MEMBERSHIP')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		const result = await Membership.findOneAndDelete({
			student: studentId,
			class: classId,
		});

		if (!result) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: 'Membership not found' });
		}

		// Clear related caches
		clearCache(`memberships_student_${studentId}`);
		clearCache(`memberships_class_${classId}`);

		res.status(StatusCodes.OK).json({
			msg: 'Membership deleted',
			membership: result,
		});
	} catch (error) {
		console.error('Error deleting membership:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
