import usersDb from "../../database/users_db.js";
import Usuario from "../models/Usuario.js";

const userController = {
  register: async (req, res) => {
    try {
      const { nombre, email, password, role = "client" } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email y password son obligatorios" });
      }

      const nuevoUsuario = await Usuario.create({
        nombre: nombre || String(email).split("@")[0] || "Usuario",
        email,
        password,
        role,
        es_corporativo: false,
      });
      const usuario = nuevoUsuario.toJSON();
      delete usuario.password;
      res
        .status(201)
        .json({ mensaje: "Creado con éxito", usuario });
    } catch (error) {
      res.status(400).json({ error: "Datos inválidos o incompletos" });
    }
  },

  update: async (req, res) => {
    try {
      // Buscamos y actualizamos en base al ID que viene en la URL (req.params.id)
      const [actualizado] = await Usuario.update(req.body, {
        where: { id: parseInt(req.params.id) },
        individualHooks: true,
      });
      if (actualizado) {
        res.json({ mensaje: "Usuario actualizado correctamente" });
      } else {
        res
          .status(404)
          .json({ error: "No se encontró el usuario a actualizar" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar" });
    }
  },

  getById: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id); // Buscar por Primary Key (ID)
      if (usuario) {
        const usuarioJson = usuario.toJSON();
        delete usuarioJson.password;
        res.json(usuarioJson);
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error en el servidor" });
    }
  },

  delete: async (req, res) => {
    try {
      const borrados = await Usuario.destroy({ where: { id: req.params.id } });
      if (borrados > 0) {
        res.json({ mensaje: "Usuario eliminado correctamente" });
      } else {
        res.status(404).json({ error: "El usuario no existe" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al intentar eliminar" });
    }
  },
};

export default userController;

// function es_corporativoUsuario(usuario_id) {
//   return lista_usuarios[usuario_id]?.es_corporativo || false;
// }

// function loguearUsuario(email, password) {
//   for (let id in lista_usuarios) {
//     const u = lista_usuarios[id];
//     if (u.email === email && u.password === password) {
//       sesion.usuario_id = u.id_usuario;
//       console.log(`✔️  El usuario se logueó correctamente`);
//       return true;
//     }
//   }
//   console.log(`❌ Error al loguearse`);
//   return false;
// }

// function cerrarSesion() {
//   sesion.usuario_id = null;
// }

// function estaLogueado() {
//   return sesion.usuario_id !== null;
// }

// function verificarSesion() {
//   if (!estaLogueado()) {
//     console.log(`❌ El usuario no está logueado. Redirigiendo al login...`);
//     return false;
//   }
//   console.log(`✔️  Usuario logueado: ID ${sesion.usuario_id}`);
//   return true;
// }
