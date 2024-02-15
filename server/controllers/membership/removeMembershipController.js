import ClassGroup from '../../models/ClassModel.js';
import User from '../../models/UserModel.js';
import Membership from '../../models/MembershipModel.js';
import { clearCache } from '../../utils/cache/cache.js';
import hasPermission from '../../utils/hasPermission.js';
import { StatusCodes } from 'http-status-codes';

// Delete (remove) a student from class membership
export const removeMemberFromClass = async (req, res) => {
	try {
		const userRole = req.user.userStatus;

		const userId = req.params.userId;
		const classId = req.params.classId;

		if (!hasPermission(userRole, 'DELETE_CLASS_MEMBERSHIP')) {
			return res.status(403).json({
				message:
					'Forbidden: You do not have permission for this action',
			});
		}

		// Find the membership document
		const membership = await Membership.findOne({
			user: userId,
			'classList.class': classId,
		});
		if (!membership) {
			return res.status(404).json({ msg: 'Membership not found' });
		}

		// Remove class from Membership document
		await Membership.findByIdAndUpdate(membership._id, {
			$pull: { classList: { class: classId } },
		});

		// Update the Class model
		await ClassGroup.findByIdAndUpdate(classId, {
			$pull: { membership: membership._id },
		});

		// Optionally, update the User model if needed
		await User.findByIdAndUpdate(userId, {
			$pull: { memberships: membership._id },
		});

		// Clear related caches
		clearCache(`class_${classId}`);
		clearCache(`membership_${userId}`);
		clearCache(`user_${userId}`);
		clearCache(`class_${userId}`);

		res.status(StatusCodes.OK).json({
			msg: 'Member removed from group membership',
		});
	} catch (error) {
		console.error('Error updating membership:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};
