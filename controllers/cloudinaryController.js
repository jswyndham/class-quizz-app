import { StatusCodes } from 'http-status-codes';
import cloudinary from '../config/cloudinaryConfig.js';

export const uploadCloudinary = async (req, res) => {
	try {
		const result = await cloudinary.uploader.upload(req.file.path, {
			resource_type: 'auto', // auto detects whether an image or video
		});
		res.status(StatusCodes.OK).json({
			message: 'Upload successful',
			url: result.url,
		});
	} catch (error) {
		console.error('Cloudinary upload error:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Error during upload',
			error: error.toString(),
		});
	}
};
