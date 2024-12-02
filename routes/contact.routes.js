import express from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import ContactController from "../controllers/contact.controllers.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles(["admin",]),
 ContactController.update
);
router.get(
  "/",
  ContactController.get
);


export default router;
