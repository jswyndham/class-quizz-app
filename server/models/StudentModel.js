import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
	{
		studentNumber: Number,
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		membrship: [
			{
				membership: {
					type: mongoose.Types.ObjectId,
					ref: 'Membership',
				},
			},
		],
		performance: [
			{
				class: {
					type: mongoose.Types.ObjectId,
					ref: 'Class',
				},
				totalScore: Number,
				quizAttempts: [
					{
						quiz: {
							type: mongoose.Types.ObjectId,
							ref: 'QuizAttempt',
						},
						score: Number,
					},
				],
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Student', StudentSchema);
