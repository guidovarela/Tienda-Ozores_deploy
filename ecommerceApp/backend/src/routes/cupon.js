import express from 'express';
const router = express.Router();
import controller from '../controllers/cuponController.js';

router.get('/', controller.getAll);
router.get('/validar', controller.validateByCode);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
