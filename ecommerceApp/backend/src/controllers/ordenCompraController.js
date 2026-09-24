import OrdenCompra from '../models/OrdenCompra.js';
import Usuario from '../models/Usuario.js';
import DetalleOrden from '../models/DetalleOrden.js';
import Producto from '../models/Producto.js';
import { Cupon } from '../models/Cupon.js';

const ordenCompraController = {

    getAll: async (req, res) => {
        try {
            const ordenes = await OrdenCompra.findAll({
                include: [
                    {
                        model: Usuario,
                        as: 'usuario'
                    },
                    {
                        model: DetalleOrden,
                        as: 'detalles',
                        include: [
                            {
                                model: Producto,
                                as: 'producto'
                            }
                        ]
                    },
                    {
                        model: Cupon,
                        as: 'cupon'
                    }
                ]
            });

            res.json(ordenes);
        } catch (error) {
            res.status(500).json({ error: "Error al consultar la base de datos" });
        }
    },

    getById: async (req, res) => {
        try {
            const orden = await OrdenCompra.findByPk(req.params.id, {
                include: [
                    {
                        model: Usuario,
                        as: 'usuario'
                    },
                    {
                        model: DetalleOrden,
                        as: 'detalles',
                        include: [
                            {
                                model: Producto,
                                as: 'producto'
                            }
                        ]
                    },
                    {
                        model: Cupon,
                        as: 'cupon'
                    }
                ]
            });

            if (!orden) {
                return res.status(404).json({ error: "Orden de compra no encontrada" });
            }

            res.json(orden);
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    getMyOrders: async (req, res) => {
        try {
            const usuarioId = Number(req.user?.id);

            if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
                return res.status(401).json({ error: "Usuario no autenticado" });
            }

            const ordenes = await OrdenCompra.findAll({
                where: { usuario_id: usuarioId },
                include: [
                    {
                        model: DetalleOrden,
                        as: 'detalles',
                        include: [
                            {
                                model: Producto,
                                as: 'producto'
                            }
                        ]
                    },
                    {
                        model: Cupon,
                        as: 'cupon'
                    }
                ],
                order: [['id_orden', 'DESC']]
            });

            res.json(ordenes);
        } catch (error) {
            res.status(500).json({ error: "Error al consultar el historial de compras" });
        }
    },

    create: async (req, res) => {
        try {
            const nuevaOrden = await OrdenCompra.create(req.body);

            res.status(201).json({
                mensaje: "Orden creada con éxito",
                orden: nuevaOrden
            });
        } catch (error) {
            res.status(400).json({ error: "Datos inválidos o incompletos" });
        }
    },

    update: async (req, res) => {
        try {
            const [actualizado] = await OrdenCompra.update(req.body, {
                where: { id_orden: req.params.id }
            });

            if (!actualizado) {
                return res.status(404).json({ error: "No se encontró la orden a actualizar" });
            }

            res.json({ mensaje: "Orden actualizada correctamente" });

        } catch (error) {
            res.status(500).json({ error: "Error al actualizar" });
        }
    },

    delete: async (req, res) => {
        try {
            const borrados = await OrdenCompra.destroy({
                where: { id_orden: req.params.id }
            });

            if (!borrados) {
                return res.status(404).json({ error: "La orden no existe" });
            }

            res.json({ mensaje: "Orden eliminada correctamente" });

        } catch (error) {
            res.status(500).json({ error: "Error al intentar eliminar" });
        }
    }
};

export default ordenCompraController;
