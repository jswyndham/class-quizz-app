import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();

if (
	!process.env.CLOUDINARY_NAME ||
	!process.env.CLOUDINARY_API_KEY ||
	!process.env.CLOUDINARY_API_SECRET
) {
	console.error('Missing required Cloudinary configuration');
	throw new Error('Missing required Cloudinary configuration');
}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

module.exports = cloudinary;
