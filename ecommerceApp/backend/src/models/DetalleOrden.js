import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DetalleOrden = sequelize.define('DetalleOrden', {
    id_orden: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_detalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    precio_unitario: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
});

export default DetalleOrden;