import mongoose from 'mongoose';
import { MEMBER_STATUS } from '../utils/constants.js';

const TeacherSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		siteMemberStatus: {
			type: String,
			enum: Object.values(MEMBER_STATUS).map((type) => type.value),
			default: MEMBER_STATUS.FREE_TIER.value,
		},
		classAdministered: [
			{
				class: {
					type: mongoose.Types.ObjectId,
					ref: 'Class',
				},
			},
		],
		classMembership: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Membership',
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Teacher', TeacherSchema);
