import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema(
	{
		className: String,

		subject: String,
		school: String,

		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
		quizzes: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Quiz',
			},
		],

		accessCode: {
			type: String,
			unique: true,
			required: true,
		},

		membership: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Membership',
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Class', ClassSchema);
