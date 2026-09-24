// server.js - El motor de nuestra aplicación
import express from 'express';
import productsRouter from './src/routes/products.js';
import userRouter from './src/routes/user.js';
import ordenCompraRouter from './src/routes/ordenCompra.js';
import detalleOrdenRouter from './src/routes/detalleOrden.js';
import carritoRouter from './src/routes/carrito.js';
import cuponRouter from './src/routes/cupon.js';
import categoriaRouter from './src/routes/categoria.js';
import authRouter from './src/routes/auth.js';
import checkoutRouter from './src/routes/checkout.js';
import { initializeDatabase } from './src/models/index.js';
import 'dotenv/config';

const app = express();
const PORT = 3000;

// Le decimos al servidor que exponga públicamente los archivos de la carpeta "public"
app.use(express.static("../frontend"));
app.use(express.json()); // Middleware para parsear JSON en las solicitudes

app.use('/api', productsRouter);
app.use('/api', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/ordenes', ordenCompraRouter);
app.use('/api/detalles', detalleOrdenRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/cupon', cuponRouter);
app.use('/api/categorias', categoriaRouter);
app.use('/api/checkout', checkoutRouter);

// Encendemos el servidor
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log('❌Error de conexión:', error);
    });
