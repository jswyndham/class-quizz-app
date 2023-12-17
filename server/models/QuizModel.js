import mongoose from 'mongoose';
import { QUESTION_TYPE } from '..//utils/constants.js';

const optionSchema = new mongoose.Schema(
	{
		optionText: String,
		isCorrect: Boolean,
	},
	{ _id: false }
);

const questionSchema = new mongoose.Schema({
	questionText: String,
	answerType: {
		type: String,
		enum: Object.values(QUESTION_TYPE),
	},
	options: [optionSchema],

	correctAnswer: String,
	hints: [String],
	points: Number,
});

const QuizSchema = new mongoose.Schema(
	{
		quizTitle: String,
		quizDescription: String,
		questions: [questionSchema],
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
		creationDate: {
			type: Date,
			default: Date.now,
		},
		lastUpdated: Date,
		duration: Number, // Duration in minutes
		category: String,
		class: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Class',
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model('Quiz', QuizSchema);
