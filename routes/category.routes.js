import express from "express";
import CategoryController from "../controllers/category.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";

const router = express.Router();

router.post("/add", authMiddleware, CategoryController.add);
router.put("/update/:id", authMiddleware, CategoryController.update);
router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRoles(["admin", "editor"]),
  CategoryController.delete
);
router.get("/all", CategoryController.getAll);
router.get("/all/cat", CategoryController.getAllCategory);
router.get("/parent/:parentCategory", CategoryController.getByParent);

export default router;
