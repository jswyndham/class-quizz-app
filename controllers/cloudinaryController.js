import { StatusCodes } from "http-status-codes";
const cloudinary = require("../config/cloudinaryConfig");

export const uploadCloudinary = async (req, res) => {
  try {
    // Assuming `file` is the key in the form-data for the upload
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", // auto detects whether an image or video
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Upload successful", url: result.url });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error during upload",
      error: error.message,
    });
  }
};
