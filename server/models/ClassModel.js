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
		classAdmin: {
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

// Virtual field to get the count of quizzes
ClassSchema.virtual('quizCount').get(function () {
	return this.quizzes.length;
});

// Virtual field to get the count of members in each class
ClassSchema.virtual('memberCount').get(function () {
	return this.membership.length;
});

export default mongoose.model('Class', ClassSchema);
