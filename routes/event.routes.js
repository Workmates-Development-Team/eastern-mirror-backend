import express from "express";
import EventController from "../controllers/event.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";

const router = express.Router();

router.get("", EventController.getAll);
router.get("/:slug", EventController.getBySlug);
router.post("", authMiddleware, EventController.create);
router.put("/:id", authMiddleware, EventController.update);
router.delete("/:id", authMiddleware, authorizeRoles(["admin", "editor"]), EventController.delete);

export default router;
