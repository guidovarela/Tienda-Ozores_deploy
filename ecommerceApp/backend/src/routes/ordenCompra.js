import express from 'express';
import ordenCompraController from '../controllers/ordenCompraController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET all
router.get('/', ordenCompraController.getAll);

router.get('/mis-compras', authenticateToken, ordenCompraController.getMyOrders);

// GET by ID
router.get('/:id', ordenCompraController.getById);

// CREATE
router.post('/', ordenCompraController.create);

// UPDATE
router.put('/:id', ordenCompraController.update);

// DELETE
router.delete('/:id', ordenCompraController.delete);

export default router;
