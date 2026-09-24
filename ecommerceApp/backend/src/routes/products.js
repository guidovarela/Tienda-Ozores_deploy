import express from 'express';
import productosController from '../controllers/productosController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/productos', productosController.getAll);

router.get('/productos/:id', productosController.getById);

router.get('/admin/productos', authenticateToken, isAdmin, productosController.getAdminAll);

router.post('/productos', authenticateToken, isAdmin, productosController.create);

router.put('/productos/:id', authenticateToken, isAdmin, productosController.update);

router.delete('/productos/:id', authenticateToken, isAdmin, productosController.delete);

export default router;
