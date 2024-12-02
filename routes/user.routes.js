import express from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import UserController from "../controllers/user.controllers.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  authorizeRoles(["admin", "editor"]),
  UserController.create
);
router.post("/login", UserController.login);
router.post("/verify-otp", UserController.verifyOtp);
router.get("/profile", authMiddleware, UserController.getProfile);
router.get(
  "/all",
  authMiddleware,
  authorizeRoles(["admin", "editor"]),
  UserController.getAllUser
);
router.put(
  "/change-password/:id",
  authMiddleware,
  authorizeRoles(["admin", "editor"]),
  UserController.changePassword
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(["admin"]),
  UserController.updateProfile
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(["admin"]),
  UserController.deleteUser
);

export default router;
