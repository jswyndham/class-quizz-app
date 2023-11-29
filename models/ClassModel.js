import mongoose from 'mongoose';
import { CLASS_STATUS } from '../utils/constants.js';

const ClassSchema = new mongoose.Schema(
	{
		className: String,

		subject: String,
		school: String,
		classStatus: {
			type: String,
			enum: Object.values(CLASS_STATUS),
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
		classQuiz: {
			type: mongoose.Types.ObjectId,
			ref: 'Quiz',
		},
	},
	{ timestamp: true }
);

export default mongoose.model('Class', ClassSchema);
