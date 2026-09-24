function ingresarDatosEnvio(datosEnvio) {
  const envio = new Envio(
    Date.now(),
    null,
    "Pendiente",
    new Date().toISOString(),
  );
  console.log(`🚚 Datos de envío registrados:`);
  console.log(`   Dirección : ${datosEnvio.direccion}`);
  console.log(`   Ciudad    : ${datosEnvio.ciudad}`);
  console.log(`   Provincia : ${datosEnvio.provincia}`);
  console.log(`   CP        : ${datosEnvio.codigo_postal}`);
  return envio;
}

const envioController = {
  getAll: async (req, res) => {
    try {
      const envios = await Envio.findAll();
      res.json(envios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const envio = await Envio.findByPk(req.params.id);
      if (envio) {
        res.json(envio);
      } else {
        res.status(404).json({ error: `Envío no encontrado` });
      }
    } catch (error) {
      res.status(500).json({ error: "Error en el servidor" });
    }},
    
  create: async (req, res) => {
    try {
      const nuevoEnvio = await Envio.create(req.body);
      res
      .status(201)
      .json({ mensaje: "Envío creado exitosamente", envio: nuevoEnvio });
    } catch (error) {
      res.status(500).json({ error: "datos incorrectos" });
    }
  },

  update: async (req, res) => {
    try {
      const [actualizado] = await Envio.update(req.body, {
        where: { id: req.params.id },
      });
      if (actualizado) {
        res.json({ mensaje: `Envío actualizado` });
      } else {
        res
        .status(404)
        .json({ error: `No se encontro el envio a actualizar` });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el envío" });
    }
  },
  delete: async (req, res) => {
    try {
    const borrado = await Envio.destroy({
      where: { id: req.params.id },
    });
    if (borrado > 0) {
      res.json({ message: `Envío eliminado` });
    } else {
      res.status(404).json({ error: `Envío no encontrado` });
    }
  } catch (error) {    res.status(500).json({ error: "Error al eliminar el envío" });
  }},
};

export default envioController;

