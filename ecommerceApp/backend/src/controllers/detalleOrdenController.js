import DetalleOrden from '../models/DetalleOrden.js';
import Producto from '../models/Producto.js';
import OrdenCompra from '../models/OrdenCompra.js';

const detalleOrdenController = {

    getAll: async (req, res) => {
        try {
            const detalles = await DetalleOrden.findAll({
                include: [
                    {
                        model: Producto,
                        as: 'producto'
                    },
                    {
                        model: OrdenCompra,
                        as: 'orden'
                    }
                ]
            });

            res.json(detalles);

        } catch (error) {
            res.status(500).json({ error: "Error al consultar la base de datos" });
        }
    },

    getById: async (req, res) => {
        try {
            const detalle = await DetalleOrden.findByPk(req.params.id, {
                include: [
                    {
                        model: Producto,
                        as: 'producto'
                    },
                    {
                        model: OrdenCompra,
                        as: 'orden'
                    }
                ]
            });

            if (!detalle) {
                return res.status(404).json({ error: "Detalle de orden no encontrado" });
            }

            res.json(detalle);

        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    create: async (req, res) => {
        try {
            const nuevoDetalle = await DetalleOrden.create(req.body);

            res.status(201).json({
                mensaje: "Detalle de orden creado con éxito",
                detalle: nuevoDetalle
            });

        } catch (error) {
            res.status(400).json({ error: "Datos inválidos o incompletos" });
        }
    },

    update: async (req, res) => {
        try {
            const [actualizado] = await DetalleOrden.update(req.body, {
                where: { id_detalle: req.params.id }
            });

            if (!actualizado) {
                return res.status(404).json({ error: "No se encontró el detalle a actualizar" });
            }

            res.json({ mensaje: "Detalle de orden actualizado correctamente" });

        } catch (error) {
            res.status(500).json({ error: "Error al actualizar" });
        }
    },

    delete: async (req, res) => {
        try {
            const borrados = await DetalleOrden.destroy({
                where: { id_detalle: req.params.id }
            });

            if (!borrados) {
                return res.status(404).json({ error: "El detalle de orden no existe" });
            }

            res.json({ mensaje: "Detalle de orden eliminado correctamente" });

        } catch (error) {
            res.status(500).json({ error: "Error al intentar eliminar" });
        }
    }
};

export default detalleOrdenController;
