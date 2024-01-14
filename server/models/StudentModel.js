import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
	{
		studentNumber: Number,
		classGroup: {
			type: mongoose.Types.ObjectId,
			ref: 'ClassGroup',
			required: true,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		performance: [
			{
				class: {
					type: mongoose.Types.ObjectId,
					ref: 'Class',
				},
				totalScore: Number,
				quizzesTaken: [
					{
						quiz: {
							type: mongoose.Types.ObjectId,
							ref: 'Quiz',
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
