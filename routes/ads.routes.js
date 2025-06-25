import express from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { authorizeRoles } from "../middlewares/role.middlewares.js";
import AdsController from "../controllers/ads.controllers.js";
import { adsUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", AdsController.getAds);
router.post(
  "/add",
  authMiddleware,
  adsUpload,
  AdsController.addAds
);

router.put(
  "/update/:id",
  authMiddleware,
  adsUpload,
  AdsController.updateAds
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(["admin", "editor"]),
  AdsController.deleteAds
);

router.get('/slider', AdsController.getSlider)
router.put('/slider/update', AdsController.updateSlider)
router.post('/slider/add', AdsController.addToSlider)
router.put('/slider/remove/:id', AdsController.removeFromSlider)
export default router;
