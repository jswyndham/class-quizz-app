import mongoose from 'mongoose';
import { USER_STATUS } from '../utils/constants.js';

const UserSchema = new mongoose.Schema(
	{
		firstName: String,
		lastName: String,
		email: String,
		password: String,
		location: String,
		userStatus: {
			type: String,
			enum: Object.values(USER_STATUS).map((type) => type.value),
		},
		membership: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Membership',
			},
		],
	},
	{ timestamps: true }
);

// don't show password for user
UserSchema.methods.toJSON = function () {
	let obj = this.toObject();
	delete obj.password;
	return obj;
};

export default mongoose.model('User', UserSchema);
