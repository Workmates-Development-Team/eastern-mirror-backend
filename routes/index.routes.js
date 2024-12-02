import express from "express";
import adminRoutes from "./admin.routes.js";
import categoryRoutes from "./category.routes.js";
import authorRoutes from "./author.routes.js";
import articleRoutes from './article.routes.js'
import userRoutes from './user.routes.js'
import galleryRoutes from './gallery.routes.js'
import videoRoutes from './video.routes.js'
import contactRoutes from './contact.routes.js'
import eventRoutes from './event.routes.js'

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/author", authorRoutes);
router.use("/article", articleRoutes);
router.use('/gallery', galleryRoutes)
router.use('/video', videoRoutes)
router.use('/contact', contactRoutes)
router.use('/event', eventRoutes)

export default router;
