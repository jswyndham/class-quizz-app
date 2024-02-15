import mongoose from 'mongoose';
import { USER_STATUS } from '../utils/constants.js';

const MembershipSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	classList: [
		{
			class: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Class',
				required: true,
			},
			joinedAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

export default mongoose.model('Membership', MembershipSchema);
