import { Router } from 'express';
import { uploadCloudinary } from '../controllers/cloudinaryController.js';
import multer from 'multer';

// 'uploads/' is a folder to temporarily store files
const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/', upload.single('file'), uploadCloudinary);

export default router;
