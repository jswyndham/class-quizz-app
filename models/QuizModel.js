import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema({
	question: String,
	answers: {
		type: String,
		enum: [
			'multiple choice',
			'short written answer',
			'long written answer',
		],
	},
	correctAnswer: String,
});

export default mongoose.model('Quiz', QuizSchema);
