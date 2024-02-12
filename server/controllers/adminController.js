import { StatusCodes } from 'http-status-codes';
import Admin from '../models/AdminModel.js';
import { getCache, setCache } from '../utils/cache/cache.js';
import hasPermission from '../utils/hasPermission.js';

// Controller to find all admin user members
export const getAdminMembers = async (req, res) => {
	const adminId = req.params.adminId;

	const cacheKey = `allAdmin_${adminId}`;

	const userRole = req.user.userStatus;

	if (!hasPermission(userRole, 'GET_ALL_ADMIN')) {
		return res.status(StatusCodes.FORBIDDEN).json({
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
		const allAdmin = await Admin.find({})
			.populate({
				path: 'user',
				select: 'firstName lastName email',
			})
			.populate({
				path: 'adminRole',
			})
			.populate({
				path: 'classMembership.classList',
				populate: { path: 'class', select: 'className' },
				select: 'joinedAt',
			})
			.populate('lastLogin')
			.lean()
			.exec();

		if (!allAdmin) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'No admin members found' });
		}

		const result = {
			admin: allAdmin,
		};

		// Cache the fetched data
		setCache(cacheKey, result, 3600); // Cache for 1 hour

		res.status(StatusCodes.OK).json(result);
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

// Controller to find a single admin user member
export const getAdminMember = async (req, res) => {
	const adminId = req.params.adminId;
	const userId = req.user.userId; // ID of the authenticated user
	const cacheKey = `admin_${adminId}`;

	const userRole = req.user.userStatus;

	if (!hasPermission(userRole, 'GET_SINGLE_ADMIN')) {
		return res.status(StatusCodes.FORBIDDEN).json({
			message: 'Forbidden: You do not have permission for this action',
		});
	}

	// Check if the authenticated user is the same as the requested admin
	if (userId.toString() !== adminId) {
		return res.status(StatusCodes.FORBIDDEN).json({
			message:
				'Forbidden: You do not have permission to access this data',
		});
	}

	try {
		// Check cache
		const cachedAdmin = getCache(cacheKey);
		if (cachedAdmin) {
			return res
				.status(StatusCodes.OK)
				.json({ findTeacher: cachedAdmin });
		}

		// Fetch from DB if not cached
		const admin = await Admin.findById(adminId)
			.populate({
				path: 'user',
				select: 'firstName lastName email',
			})
			.populate({
				path: 'adminRole',
			})
			.populate({
				path: 'classMembership.classList',
				populate: { path: 'class', select: 'className' },
				select: 'joinedAt',
			})
			.populate('lastLogin')
			.lean()
			.exec();

		// If no teachers return
		if (!admin) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: 'Admin was not found' });
		}

		// Cache the fetched data
		setCache(cacheKey, admin, 3600); // Cache for 1 hour

		res.status(StatusCodes.OK).json({ admin });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: error.message,
		});
	}
};

export const getAdminDashboard = async (req, res) => {
	// Logic to fetch and aggregate data for the admin dashboard
};

export const manageUsers = async (req, res) => {
	// Logic to manage users (CRUD operations)
};

export const viewAuditLogs = async (req, res) => {
	// Logic to fetch and present audit logs
};

export const updateSystemSettings = async (req, res) => {
	// Logic to update system settings
};
