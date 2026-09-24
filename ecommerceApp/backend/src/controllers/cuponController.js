import { Op } from 'sequelize';
import { Cupon } from '../models/Cupon.js';

function normalizeCouponCode(value) {
  return String(value ?? '').trim().toUpperCase();
}

function toDateOnly(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10);
}

function normalizeDiscountValue(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return 0;
  }

  return amount <= 1 ? amount * 100 : amount;
}

function isCouponValidForToday(coupon, today = toDateOnly(new Date().toISOString())) {
  const validFrom = toDateOnly(coupon.validoDesde || coupon.fecha_vencimiento || '2000-01-01');
  const validTo = toDateOnly(coupon.validoHasta || coupon.fecha_vencimiento || '2099-12-31');
  const isActive = coupon.activo !== false;
  const discount = normalizeDiscountValue(coupon.descuento);

  return (
    isActive &&
    discount === 10 &&
    validFrom <= today &&
    today <= validTo
  );
}

function buildCouponResponse(coupon) {
  return {
    id_cupon: coupon.id_cupon,
    nombre: coupon.nombre,
    descuento: Number(coupon.descuento),
    descuentoPorcentaje: normalizeDiscountValue(coupon.descuento),
    validoDesde: coupon.validoDesde ?? null,
    validoHasta: coupon.validoHasta ?? null,
    fecha_vencimiento: coupon.fecha_vencimiento ?? null,
    activo: coupon.activo !== false,
  };
}

const cuponController = {
  getAll: async (req, res) => {
    try {
      const cupones = await Cupon.findAll({
        order: [['id_cupon', 'ASC']],
      });
      res.json(cupones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los cupones' });
    }
  },

  getById: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const cupon = await Cupon.findByPk(id);

      if (!cupon) {
        res.status(404).json({ error: 'Cupón no encontrado' });
        return;
      }

      res.json(cupon);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el cupón' });
    }
  },

  validateByCode: async (req, res) => {
    try {
      const codigo = normalizeCouponCode(req.query.codigo);

      if (!codigo) {
        return res.status(400).json({ error: 'Debés ingresar un código de cupón' });
      }

      const cupon = await Cupon.findOne({
        where: {
          nombre: {
            [Op.eq]: codigo,
          },
        },
      });

      if (!cupon) {
        return res.status(404).json({ error: 'El cupón no existe' });
      }

      if (!isCouponValidForToday(cupon)) {
        return res.status(400).json({
          error: 'El cupón no está activo o ya no tiene vigencia',
        });
      }

      res.json({
        valido: true,
        cupon: buildCouponResponse(cupon),
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al validar el cupón' });
    }
  },

  create: async (req, res) => {
    try {
      const nombre = normalizeCouponCode(req.body.nombre);
      const descuento = Number(req.body.descuento);
      const validoDesde = req.body.validoDesde || req.body.fecha_vencimiento || '2000-01-01';
      const validoHasta = req.body.validoHasta || req.body.fecha_vencimiento || '2099-12-31';
      const activo = req.body.activo !== undefined ? req.body.activo : true;

      if (!nombre || !Number.isFinite(descuento)) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const nuevoCupon = await Cupon.create({
        ...req.body,
        nombre,
        descuento,
        validoDesde,
        validoHasta,
        activo,
      });

      res.status(201).json({
        mensaje: 'Cupón creado exitosamente',
        cupon: nuevoCupon,
      });
    } catch (error) {
      res.status(400).json({ error: 'Datos inválidos o incompletos' });
    }
  },

  update: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const cambios = { ...req.body };

      if (cambios.nombre !== undefined) {
        cambios.nombre = normalizeCouponCode(cambios.nombre);
      }

      if (cambios.descuento !== undefined) {
        cambios.descuento = Number(cambios.descuento);
      }

      if (cambios.validoDesde === undefined && cambios.fecha_vencimiento !== undefined) {
        cambios.validoDesde = cambios.fecha_vencimiento;
      }

      if (cambios.validoHasta === undefined && cambios.fecha_vencimiento !== undefined) {
        cambios.validoHasta = cambios.fecha_vencimiento;
      }

      const [actualizado] = await Cupon.update(cambios, {
        where: { id_cupon: id },
      });

      if (actualizado) {
        res.json({ mensaje: 'Cupón actualizado correctamente' });
      } else {
        res.status(404).json({ error: 'Cupón no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar' });
    }
  },

  delete: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const borrados = await Cupon.destroy({ where: { id_cupon: id } });

      if (borrados > 0) {
        return res.json({ mensaje: 'Cupón eliminado correctamente' });
      }

      return res.status(404).json({ error: 'Cupón no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar' });
    }
  },
};

export default cuponController;
