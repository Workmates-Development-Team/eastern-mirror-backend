import express from 'express';
// import { verifyAdmin } from '../middlewares/authMiddleware.js';
import AdminController from '../controllers/admin.controllers.js';
import authMiddleware from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/register', AdminController.register);
router.post('/login', AdminController.login);
router.get('/profile', authMiddleware, AdminController.getProfile);

export default router;
