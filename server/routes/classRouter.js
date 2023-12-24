import { Router } from "express";
import {
  validateClassInput,
  validateIdParam,
} from "../middleWare/validationMiddleware.js";
import {
  getClass,
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  joinClass,
} from "../controllers/classController.js";
import { authorizePermissions } from "../middleWare/authMiddleware.js";
import { USER_STATUS } from "../utils/constants.js";

const router = Router();

// validation middleware is imported and applied to the necessary routes
router.route("/").get(getAllClasses).post(validateClassInput, createClass);
router
  .route("/:id")
  .get(validateIdParam, getClass)
  .patch(validateIdParam, validateClassInput, updateClass)
  .delete(validateIdParam, deleteClass);

router.post(
  "/:id/join",
  authorizePermissions(USER_STATUS.STUDENT),
  validateIdParam,
  joinClass
);

export default router;
