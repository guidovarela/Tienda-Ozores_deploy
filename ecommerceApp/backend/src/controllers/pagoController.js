const listaPagos = [];

function metodoPagoValido(metodo_pago) {
  return typeof metodo_pago === "string" && metodo_pago.trim().length > 0;
}

function obtenerEstadoPago(pagoAprobado) {
  return pagoAprobado ? "Aprobado" : "Rechazado";
}

function crearPago(id_pago, orden_id, estado_pago, metodo_pago, fecha_pago) {
  if (!orden_id) {
    console.log("No existe una orden asociada al pago");
    return null;
  }

  if (!metodoPagoValido(metodo_pago)) {
    console.log("No se selecciono un metodo de pago valido");
    return null;
  }

  return {
    id_pago,
    orden_id,
    estado_pago,
    metodo_pago: metodo_pago.trim(),
    fecha_pago: new Date(fecha_pago),
  };
}

function seleccionarMetodoPago(metodo_pago) {
  if (!metodoPagoValido(metodo_pago)) {
    console.log("No se selecciono un metodo de pago valido");
    return null;
  }

  return metodo_pago.trim();
}

function procesarPago(
  orden,
  metodo_pago,
  pagoAprobado = true,
  id_pago = Date.now(),
  fecha_pago = new Date().toISOString(),
) {
  if (!orden || !orden.id_orden) {
    console.log("No existe la orden para procesar el pago");
    return null;
  }

  const metodoSeleccionado = seleccionarMetodoPago(metodo_pago);

  if (!metodoSeleccionado) {
    return null;
  }

  const estadoPago = obtenerEstadoPago(pagoAprobado);
  return crearPago(
    id_pago,
    orden.id_orden,
    estadoPago,
    metodoSeleccionado,
    fecha_pago,
  );
}

function registrarPago(
  orden,
  metodo_pago,
  pagoAprobado = true,
  id_pago,
  fecha_pago,
) {
  const siguienteIdPago = id_pago ?? listaPagos.length + 1;
  const pago = procesarPago(
    orden,
    metodo_pago,
    pagoAprobado,
    siguienteIdPago,
    fecha_pago,
  );

  if (!pago) {
    return null;
  }

  listaPagos.push(pago);
  return pago;
}

const pagoController = {
  listaPagos,
  metodoPagoValido,
  obtenerEstadoPago,
  crearPago,
  seleccionarMetodoPago,
  procesarPago,
  registrarPago,
};

export {
  listaPagos,
  metodoPagoValido,
  obtenerEstadoPago,
  crearPago,
  seleccionarMetodoPago,
  procesarPago,
  registrarPago,
};

export default pagoController;
