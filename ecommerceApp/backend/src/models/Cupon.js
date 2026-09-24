import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cupon = sequelize.define('Cupon', {
  id_cupon: {
    type: DataTypes.INTEGER,  
    primaryKey: true,
    autoIncrement: true
  },  
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },  
  descuento: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  validoDesde: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '2000-01-01'
  },
  validoHasta: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '2099-12-31'
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export { Cupon };
