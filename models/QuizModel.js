import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema({
	quizTitle: String,
	newQuestion: {
		type: mongoose.Types.ObjectId,
		ref: 'Question',
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
});

export default mongoose.model('Quiz', QuizSchema);
