import express from "express";
import ArticleController from "../controllers/article.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { thumbnailUpload } from "../middlewares/uploadMiddleware.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  thumbnailUpload.single("image"),
  ArticleController.add
);

router.put(
  "/edit/:id",
  authMiddleware,
  thumbnailUpload.single("image"),
  ArticleController.edit
);

router.patch(
  "/toggle-publish/:id",
  authMiddleware,
  ArticleController.togglePublish
);
router.put("/update/:id", authMiddleware, ArticleController.update);
router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles(["admin", "editor"]),
  ArticleController.delete
);
router.get("/all", ArticleController.getAll);
router.get("/search", ArticleController.searchArticle);
router.get("/by/:slug", ArticleController.getBySlug);

export default router;
