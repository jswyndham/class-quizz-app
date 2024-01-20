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
		students: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Student',
			},
		],
		accessCode: {
			type: String,
			unique: true,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Class', ClassSchema);
