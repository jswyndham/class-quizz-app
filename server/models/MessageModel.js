import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	recipient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	messageContent: {
		type: String,
		required: true,
	},
	read: {
		type: Boolean,
		default: false,
	},
	sentAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('Message', MessageSchema);
