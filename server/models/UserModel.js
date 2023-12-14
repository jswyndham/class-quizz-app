import mongoose from 'mongoose';
import { USER_STATUS } from '../utils/constants.js';

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		default: 'firstName',
	},
	lastName: String,
	email: String,
	password: String,
	location: String,
	userStatus: {
		type: String,
		enum: Object.values(USER_STATUS),
	},
});

// don't show password for user
UserSchema.methods.toJSON = function () {
	let obj = this.toObject();
	delete obj.password;
	return obj;
};

export default mongoose.model('User', UserSchema);
