import mongoose from 'mongoose';

const QuizAttemptSchema = new mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		quiz: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Quiz',
			required: true,
		},
		answers: [
			{
				questionId: mongoose.Schema.Types.ObjectId,
				selectedOption: String, // or an ObjectId if your options are separate documents
			},
		],
		score: Number,
		completed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('QuizAttempt', QuizAttemptSchema);
