import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrdenCompra = sequelize.define('OrdenCompra', {
    id_orden: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    cupon_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    total: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    fecha_compra: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    estado_compra: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

export default OrdenCompra;
