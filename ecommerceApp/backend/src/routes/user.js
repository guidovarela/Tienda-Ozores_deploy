import express from 'express';
import userController from '../controllers/usuarioController.js';
const router = express.Router();

router.post('/register', userController.register);

router.put('/usuarios/:id', userController.update);

router.get('/usuarios/:id', userController.getById);

router.delete('/usuarios/:id', userController.delete);

export default router;
