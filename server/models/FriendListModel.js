import mongoose from 'mongoose';

const QuizRequestSchema = new mongoose.Schema(
	{
		quiz: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Quiz',
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		sentAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: false }
);

const SharedQuizSchema = new mongoose.Schema(
	{
		quiz: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Quiz',
			required: true,
		},
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		email: [
			{
				type: String,
			},
		],
		sharedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: false }
);

const FriendListSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		pendingRequests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		sentRequests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		groupAccountsConnected: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'GroupAccount',
			},
		],
		message: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message',
			},
		],
		pendingQuizRequests: [QuizRequestSchema],
		quizzesShared: [SharedQuizSchema],
	},
	{ timestamps: true }
);

export default mongoose.model('FriendList', FriendListSchema);
