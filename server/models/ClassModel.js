import mongoose from 'mongoose';
import { DAYS_OF_THE_WEEK } from '../utils/constants.js';

const TimeSchema = new mongoose.Schema(
	{
		start: Date,
		end: Date,
	},
	{ _id: false }
); // _id is set to false because there is no need for separate IDs for start and end times

const ClassSchema = new mongoose.Schema(
	{
		className: String,
		subject: String,
		school: String,
		dayOfTheWeek: {
			type: String,
			enum: Object.values(DAYS_OF_THE_WEEK).map((day) => day.value),
			required: true,
		},
		classTime: TimeSchema,

		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
		classAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		quizzes: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Quiz',
			},
		],
		accessCode: {
			type: String,
			unique: true,
			required: true,
		},
		membership: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Membership',
			},
		],
	},
	{ timestamps: true }
);

// Indexing the membership field
ClassSchema.index({ membership: 1 });

// Virtual field to get the count of quizzes
ClassSchema.virtual('quizCount').get(function () {
	return this.quizzes ? this.quizzes.length : 0;
});

// Virtual field to get the count of members in each class
ClassSchema.virtual('memberCount').get(function () {
	return this.membership ? this.membership.length : 0;
});

export default mongoose.model('Class', ClassSchema);
