import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Student',
		required: true,
	},
	class: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Class',
		required: true,
	},
	joinedAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('Membership', MembershipSchema);
