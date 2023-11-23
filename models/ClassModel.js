import mongoose from 'mongoose';
import { CLASS_STATUS } from '../utils/constants.js';
// import slugify from 'slugify';

const ClassSchema = new mongoose.Schema(
	{
		className: String,
		// slug: {
		// 	type: String,
		// 	unique: true,
		// },
		subject: String,
		school: String,
		classStatus: {
			type: String,
			enum: Object.values(CLASS_STATUS),
			default: CLASS_STATUS.CURRENT,
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

// ClassSchema.pre('save', function (next) {
// 	if (this.isModified('className') || this.isNew) {
// 		this.slug = slugify(this.className, { lower: true, strict: true });
// 	}
// 	next();
// });

export default mongoose.model('Class', ClassSchema);
