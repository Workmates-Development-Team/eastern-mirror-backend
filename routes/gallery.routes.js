import express from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { thumbnailUpload } from "../middlewares/uploadMiddleware.js";
import GalleryController from "../controllers/gallery.controllers.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  thumbnailUpload.single("thumbnail"),
  GalleryController.upload
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(["admin", "editor"]),
  GalleryController.delete
);

router.get("/", authMiddleware, GalleryController.getAll);

router.patch("/:id/caption", GalleryController.updateCaption);

export default router;
