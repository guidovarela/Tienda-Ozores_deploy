import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Definir la tabla 'Carrito

const Carrito = sequelize.define('Carrito', {
  id_carrito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export { Carrito };

