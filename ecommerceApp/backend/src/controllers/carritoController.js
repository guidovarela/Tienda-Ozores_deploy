import carritoDB from '../../database/carrito_db.js';
import { Carrito } from '../models/Carrito.js';

const carritoController = {
  getAll: async (req, res) => {
    try {
      const carritos = await Carrito.findAll(); 
      res.json(carritos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los carritos" });
    }
  },

  create: async (req, res) => {
      try {
          const nuevoCarrito = await Carrito.create(req.body);
          res.status(201).json({ mensaje: 'Carrito creado exitosamente', carrito: nuevoCarrito });
      } catch (error) {
          res.status(400).json({ error: "Datos inválidos o incompletos" });
      }   
  },

  update: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { usuario, ItemCarrito } = req.body;
      const [actualizado] = await Carrito.update(req.body, {
         where: { id_carrito: id }
         });
          
      if (actualizado) {
        res.json({ mensaje: "Carrito actualizado correctamente" });
      } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar" });
    }
  },
    
  getById: async (req, res) => {
    const idCarrito = parseInt(req.params.id);
    const carrito = await Carrito.findByPk(idCarrito);
    if (!carrito) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    } 
    return res.json(carrito);
  },

  delete: async (req, res) => {
    try { 
      const id = Number(req.params.id);
      const borrados = await Carrito.destroy({ where: { id_carrito: id } });
      if (borrados === 0) {
          res.status(404).json({ error: 'Carrito no encontrado' });
      } else {
          res.json({ mensaje: "Carrito eliminado correctamente" });
      } 
      } catch (error) {
          res.status(500).json({ error: "Error al eliminar" });
      }
    }
};
export default carritoController;
