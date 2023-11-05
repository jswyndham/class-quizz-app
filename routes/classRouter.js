import { Router } from 'express';

const router = Router();

import {
	getClass,
	getAllClasses,
	createClass,
	updateClass,
	deleteClass,
} from '../controllers/classController.js';

router.route('/').get(getAllClasses).post(createClass);
router.route('/:id').get(getClass).patch(updateClass).delete(deleteClass);

export default router;
