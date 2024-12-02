import express from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import VideoController from "../controllers/video.controllers.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";

const router = express.Router();

router.get(
  "/",
  VideoController.getVideos
);
router.post(
  "/add",
  authMiddleware,
  VideoController.addVideo
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(["admin", "editor"]),
  VideoController.deleteVideo
);


export default router;
