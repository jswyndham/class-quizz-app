import mongoose from 'mongoose';
// import QuizModel from './QuizModel';

const ClassSchema = new mongoose.Schema(
	{
		className: String,
		subject: String,
		classStatus: {
			type: String,
			enum: ['current', 'finished', 'upcoming'],
			default: 'current',
		},
		// quiz: {
		// 	type: [Schema.Types.ObjectId],
		// 	ref: 'Quiz',
		// },
	},
	{ timestamp: true }
);

export default mongoose.model('Class', ClassSchema);
