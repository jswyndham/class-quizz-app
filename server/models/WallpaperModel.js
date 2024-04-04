import mongoose from 'mongoose';

const WallpaperSchema = new mongoose.Schema(
	{
		// Unique identifier for the wallpaper
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		// URL to the wallpaper image
		imageUrl: {
			type: String,
			required: true,
		},
		// Description or additional information about the wallpaper
		description: {
			type: String,
			trim: true,
		},
		// Category or type of the wallpaper (optional)
		category: {
			type: String,
			trim: true,
		},
		// Metadata like upload date or the uploader's information (optional)
		metadata: {
			uploadedBy: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			uploadDate: {
				type: Date,
				default: Date.now,
			},
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Wallpaper', WallpaperSchema);
