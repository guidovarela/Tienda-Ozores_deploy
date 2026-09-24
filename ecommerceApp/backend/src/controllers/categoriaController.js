import Categoria from "../models/Categoria.js";
import Producto from "../models/Producto.js";
import { verifyToken } from "../utils/jwt.js";

function isAdminRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    return payload?.role === "admin";
  } catch (error) {
    return false;
  }
}

function parseBooleanValue(value, fallback = null) {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (value === true || value === "true" || value === 1 || value === "1") {
    return true;
  }

  if (value === false || value === "false" || value === 0 || value === "0") {
    return false;
  }

  return fallback;
}

const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      where: isAdminRequest(req) ? {} : { visible: true },
    });
    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener las categorÃ­as:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (categoria && (categoria.visible || isAdminRequest(req))) {
      res.json(categoria);
    } else {
      res.status(404).json({ message: "CategorÃ­a no encontrada" });
    }
  } catch (error) {
    console.error("Error al obtener la categorÃ­a:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const createCategoria = async (req, res) => {
  try {
    const nombre = String(req.body?.nombre ?? "").trim();
    if (!nombre) {
      return res.status(400).json({ message: "El nombre de la categorÃ­a es obligatorio" });
    }

    const visible = parseBooleanValue(req.body?.visible, true);
    const nuevaCategoria = await Categoria.create({ nombre, visible });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error("Error al crear la categorÃ­a:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const updateCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: "CategorÃ­a no encontrada" });
    }

    const updates = {};

    if (Object.prototype.hasOwnProperty.call(req.body ?? {}, "nombre")) {
      const nombre = String(req.body?.nombre ?? "").trim();
      if (!nombre) {
        return res.status(400).json({ message: "El nombre de la categorÃ­a es obligatorio" });
      }

      updates.nombre = nombre;
    }

    if (Object.prototype.hasOwnProperty.call(req.body ?? {}, "visible")) {
      const visible = parseBooleanValue(req.body?.visible, null);
      if (visible === null) {
        return res.status(400).json({ message: "La visibilidad de la categorÃ­a no es vÃ¡lida" });
      }

      updates.visible = visible;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No se enviaron cambios para actualizar" });
    }

    const [actualizado] = await Categoria.update(updates, {
      where: { id_categoria: req.params.id },
    });

    if (actualizado) {
      const categoriaActualizada = await Categoria.findByPk(req.params.id);
      res.json(categoriaActualizada);
    } else {
      res.status(404).json({ message: "CategorÃ­a no encontrada" });
    }
  } catch (error) {
    console.error("Error al actualizar la categorÃ­a:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: "CategorÃ­a no encontrada" });
    }

    const productosAsociados = await Producto.count({
      where: { id_categoria: req.params.id },
    });

    if (productosAsociados > 0) {
      return res.status(400).json({
        message: "No se puede eliminar una categorÃ­a que todavÃ­a tiene productos asociados",
      });
    }

    const borrados = await Categoria.destroy({ where: { id_categoria: req.params.id } });
    if (borrados) {
      res.json({ message: "CategorÃ­a eliminada correctamente" });
    } else {
      res.status(404).json({ message: "CategorÃ­a no encontrada" });
    }
  } catch (error) {
    console.error("Error al eliminar la categorÃ­a:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const categoriaController = {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
