const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinaryConfig');

router.post('/upload', async (req, res) => {
	try {
		// Assuming `file` is the key in the form-data for the upload
		const result = await cloudinary.uploader.upload(req.file.path, {
			resource_type: 'auto', // auto detects whether an image or video
		});

		// Save the URL or other details from `result` to your database as needed

		res.json({ message: 'Upload successful', url: result.url });
	} catch (error) {
		res.status(500).json({
			message: 'Error during upload',
			error: error.message,
		});
	}
});

module.exports = router;
