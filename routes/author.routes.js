import express from "express";
import AuthorController from "../controllers/author.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { avatarUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  avatarUpload,
  AuthorController.add
);
router.put(
  "/update/:id",
  authMiddleware,
  avatarUpload,
  AuthorController.update
);
router.delete("/soft-delete/:id", authMiddleware, AuthorController.softDelete);
router.get("/all", AuthorController.getAll);
router.get("/details/:id", AuthorController.getById);

export default router;
