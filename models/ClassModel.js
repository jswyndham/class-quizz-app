import mongoose from 'mongoose';
import { CLASS_STATUS } from '../utils/constants.js';
// import QuizModel from './QuizModel';

const ClassSchema = new mongoose.Schema(
	{
		className: String,
		subject: String,
		school: String,
		classStatus: {
			type: String,
			enum: Object.values(CLASS_STATUS),
			default: CLASS_STATUS.CURRENT,
		},
		// quiz: {
		// 	type: [Schema.Types.ObjectId],
		// 	ref: 'Quiz',
		// },
	},
	{ timestamp: true }
);

export default mongoose.model('Class', ClassSchema);
