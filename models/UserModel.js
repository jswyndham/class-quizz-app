import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		default: 'firstName',
	},
	lastName: String,
	email: String,
	password: String,
	location: String,
	role: {
		type: String,
		enum: ['student', 'teacher', 'admin'],
		default: 'teacher',
	},
});

export default mongoose.model('User', UserSchema);
