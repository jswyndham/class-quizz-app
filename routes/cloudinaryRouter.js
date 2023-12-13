import { Router } from "express";
import { uploadCloudinary } from "../controllers/cloudinaryController";

const router = Router();

router.route("/").post(uploadCloudinary);

module.exports = router;
