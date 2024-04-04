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
		enum: Object.values(QUESTION_TYPE).map((type) => type.value),
	},
	options: [optionSchema],

	correctAnswer: String,
	hints: [String],
	points: Number,
	timer: Number, // Timer in seconds for each question
});

const QuizSchema = new mongoose.Schema(
	{
		quizTitle: String,
		quizDescription: String,
		isVisibleBeforeStart: Boolean,
		releaseDate: {
			type: Date,
			default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to one week after creation
		},
		questions: [questionSchema],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		duration: Number, // Duration in minutes
		category: String,
		class: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Class',
		},

		backgroundColor: {
			type: String,
			default: '#FFFFFF',
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		isVisibleToStudent: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);

// Virtual field to get the count of questions
QuizSchema.virtual('questionCount').get(function () {
	return this.questions.length;
});

// Virtual field to calculate total points
QuizSchema.virtual('totalPoints').get(function () {
	return this.questions.reduce((sum, question) => sum + question.points, 0);
});

// Virtual field or method to determine if the quiz is active
QuizSchema.virtual('isActive').get(function () {
	const now = new Date();
	return now >= this.startDate && now <= this.endDate;
});

export default mongoose.model('Quiz', QuizSchema);
