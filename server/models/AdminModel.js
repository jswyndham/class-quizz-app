import mongoose from 'mongoose';
import { ADMIN_STATUS } from '../utils/constants.js';

const AdminSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		// Admin-specific roles or privileges
		roles: [
			{
				type: String,
				enum: Object.values(ADMIN_STATUS).map((type) => type.value),
				required: true,
			},
		],

		// Admin can join a class
		classMembership: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Membership',
			},
		],

		// Additional fields specific to admin operations
		lastLogin: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Admin', AdminSchema);
