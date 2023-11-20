import mongoose from 'mongoose';
import { QUESTION_TYPE } from '../utils/constants.js';

const QuestionSchema = new mongoose.Schema({
	question: String,
	answerType: {
		type: String,
		enum: Object.values(QUESTION_TYPE),
	},
	correctAnswer: String,
});

// don't show answer to user
QuestionSchema.methods.toJSON = function () {
	let obj = this.toObject();
	delete obj.correctAnswer;
	return obj;
};

export default mongoose.model('Question', QuestionSchema);
