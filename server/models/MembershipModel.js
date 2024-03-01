import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	classList: [
		{
			class: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Class',
				required: true,
			},
			joinedAt: {
				type: Date,
				default: Date.now,
			},
			quizAttempts: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'QuizAttempt',
				},
			],
		},
	],
});

export default mongoose.model('Membership', MembershipSchema);
