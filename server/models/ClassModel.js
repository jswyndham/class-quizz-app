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
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
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

// Indexing the membership field
ClassSchema.index({ membership: 1 });

export default mongoose.model('Class', ClassSchema);
