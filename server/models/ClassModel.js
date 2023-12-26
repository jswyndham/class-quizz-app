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
	},
	{ timestamps: true }
);

export default mongoose.model('Class', ClassSchema);
