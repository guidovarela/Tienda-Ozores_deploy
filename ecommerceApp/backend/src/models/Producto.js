import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Definimos la tabla 'Productos'
const Producto = sequelize.define('Producto', {
    // El ID se crea solo por defecto (Autoincremental), no hace falta ponerlo
    nombre: {
        type: DataTypes.STRING,
        allowNull: false // Obligatorio
    },
    precio: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    descuento: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    porcentajeDescuento: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: "https://via.placeholder.com/150" // Imagen por defecto
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    validoDesde: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    validoHasta: {
        type: DataTypes.DATEONLY,
        defaultValue: '2099-12-31'
    }
}, {
    freezeTableName: true
});

// export class Producto {
//   constructor(id_producto, nombre, precio, stock, img) {
//     this.id_producto = id_producto;
//     this.nombre = nombre;
//     this.precio = precio;
//     this.stock = stock;
//     this.img = img;
//   }
// }

export default Producto;
