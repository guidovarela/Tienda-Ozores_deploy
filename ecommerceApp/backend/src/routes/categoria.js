import express from 'express';
const router = express.Router();
import {categoriaController} from '../controllers/categoriaController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

router.get('/', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post('/', authenticateToken, isAdmin, categoriaController.createCategoria);
router.put('/:id', authenticateToken, isAdmin, categoriaController.updateCategoria);
router.delete('/:id', authenticateToken, isAdmin, categoriaController.deleteCategoria);  

export default router;
