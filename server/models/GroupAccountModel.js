import mongoose from 'mongoose';
import { USER_STATUS } from '../utils/constants';

const GroupAccountSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	address: {
		street: String,
		city: String,
		state: String,
		zipCode: String,
		country: String,
	},
	contactInfo: {
		email: {
			type: String,
			trim: true,
			lowercase: true,
		},
		phone: String,
	},
	siteMemberStatus: {
		type: String,
		enum: Object.values(MEMBER_STATUS).map((type) => type.value),
		default: MEMBER_STATUS.FREE_TIER.value,
	},
	billingDetails: {
		billingContact: {
			name: String,
			email: String,
			phone: String,
		},
		billingAddress: {
			street: String,
			city: String,
			state: String,
			zipCode: String,
			country: String,
		},
		subscriptionStartDate: {
			type: Date,
			default: Date.now,
		},
		subscriptionEndDate: {
			type: Date,
			default: () =>
				new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // One year from day of application
		},
	},
	members: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: USER_STATUS.TEACHER.value,
		},
	],
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('GroupAccount', GroupAccountSchema);
