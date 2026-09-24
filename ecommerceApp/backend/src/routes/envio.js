import express from 'express';
import envioController from '../controllers/envioController.js'; 

const express = require('express');
const router = express.Router();

router.get('/envio/:id', envioController.getAll);

router.get('/envio/:id', envioController.getById);

router.post('/envio', envioController.create);

router.put('/envio/:id', envioController.update);

router.delete('/envio/:id', envioController.delete);

module.exports = router;