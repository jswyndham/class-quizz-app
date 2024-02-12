import ClassGroup from '../../models/ClassModel.js';
import AuditLog from '../../models/AuditLogModel';
import { StatusCodes } from 'http-status-codes';
import hasPermission from '../../utils/hasPermission.js';

// Controller to transfer class admin rights
export const transferClassAdmin = async (req, res) => {
	// User permissions
	const userRole = req.user.userStatus;
	if (!hasPermission(userRole, 'TRANSFER_ADMIN_RIGHTS')) {
		return res.status(StatusCodes.FORBIDDEN).json({
			message: 'Forbidden: You do not have permission for this action',
		});
	}

	try {
		const { classId, newAdminUserId } = req.body;
		const currentUserId = req.user.userId;

		// Fetch the class
		const classGroup = await ClassGroup.findById(classId);
		if (!classGroup) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Class not found' });
		}

		// Check if the current user is the admin
		if (classGroup.classAdmin.toString() !== currentUserId) {
			return res
				.status(403)
				.json({ message: 'You are not the admin of this class' });
		}

		// Update the class admin
		classGroup.classAdmin = newAdminUserId;
		await classGroup.save();

		// Create an audit log for the transfer
		const auditLog = new AuditLog({
			action: 'TRANSFER_CLASS_ADMIN',
			subjectType: 'Class',
			subjectId: classId,
			userId: currentUserId,
			details: {
				reason: `Admin rights transferred to user ${newAdminUserId}`,
			},
		});
		await auditLog.save();

		// Clear the cache related to the user's classes
		const classCacheKey = `class_${userId}`;
		clearCache(classCacheKey);

		return res
			.status(StatusCodes.ACCEPTED)
			.json({ message: 'Admin rights transferred successfully' });
	} catch (error) {
		console.error('Error creating class:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
