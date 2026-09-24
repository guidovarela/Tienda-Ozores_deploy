import express from 'express';

import detalleOrdenController from '../controllers/detalleOrdenController.js';

const router = express.Router();

router.get('/', detalleOrdenController.getAll);

router.get('/:id', detalleOrdenController.getById);

router.post('/', detalleOrdenController.create);

router.put('/:id', detalleOrdenController.update);

router.delete('/:id', detalleOrdenController.delete);

export default router;