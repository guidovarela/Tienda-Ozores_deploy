import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { comparePassword, hashPassword } from '../utils/password.js';

async function hashUserPassword(usuario) {
    if (usuario.password && !usuario.password.startsWith('scrypt:')) {
        usuario.password = await hashPassword(usuario.password);
    }
}

const Usuario = sequelize.define('Usuario', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    es_corporativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    role: {
        type: DataTypes.STRING,
        defaultValue: 'client'
    },

    orden_compra: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    freezeTableName: true,
    hooks: {
        beforeCreate: hashUserPassword,
        beforeUpdate: async (usuario) => {
            if (usuario.changed('password')) {
                await hashUserPassword(usuario);
            }
        }
    }
});

Usuario.prototype.comparePassword = function (plainPassword) {
    return comparePassword(plainPassword, this.password);
};

export default Usuario;
