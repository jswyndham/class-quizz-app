import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
	{
		class: {
			type: mongoose.Types.ObjectId,
			ref: 'Class',
		},
		student: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
		classMember: Boolean,
	},
	{ timestamp: true }
);

export default mongoose.model('Student', StudentSchema);
