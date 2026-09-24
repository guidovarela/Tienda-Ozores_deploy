import express from 'express';
import checkoutController from '../controllers/checkoutController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, checkoutController.checkout);

export default router;
