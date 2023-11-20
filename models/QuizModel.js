import mongoose from 'mongoose';
import { QUESTION_TYPE } from '../utils/constants.js';

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
	// difficulty: {
	// 	type: String,
	// 	enum: ['easy', 'medium', 'hard'],
	// },

	correctAnswer: String,
	hints: [String],
	points: Number,
});

const QuizSchema = new mongoose.Schema({
	quizTitle: String,
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
	// tags: [String],
});

export default mongoose.model('Quiz', QuizSchema);
