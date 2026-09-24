function generarOrden(id_carrito, cupon_id) {
  const carrito = lista_carritos[id_carrito];
  const id_orden = _generarIdOrden();
  const orden = new OrdenCompra(id_orden, new Date().toISOString());
  orden.usuario_id = sesion.usuario_id;
  orden.cupon_id = cupon_id;

  let detalleCounter = 1;
  for (const item of carrito.ItemCarrito) {
    
    const detalle = new DetalleOrden(
      id_orden,
      detalleCounter++,
      item.cantidad,
      item.producto_id.precio,
    );
    detalle.producto_id = item.producto_id;
    orden.agregarDetalle(detalle);
  }

  const subtotal = orden.DetalleOrden.reduce(
    (acc, d) => acc + d.subtotalDetalleOrden(),
    0,
  );
  console.log(
    `   Subtotal (sin descuentos): $${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
  );

  if (es_corporativoUsuario(sesion.usuario_id)) {
    console.log(`✔️  El usuario ES CORPORATIVO → se aplica 10% de descuento`);
  } else if (cupon_id && validarCupon(cupon_id)) {
    console.log(
      `✔️  Cupón válido → se aplica ${descuentoCupon(cupon_id) * 100}% de descuento`,
    );
  } else {
    console.log(`   Sin descuento aplicable`);
  }

  const total = orden.calcularTotal();
  console.log(
    `💰 Total final: $${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
  );

  orden.estado_compra = "Generada";
  // buscarUsuario(sesion.usuario_id).OrdenCompra.push(orden);

  console.log(`📋 Orden de compra generada:`);
  console.log(`   ID Orden  : ${orden.id_orden}`);
  console.log(`   Usuario   : ${buscarUsuario(sesion.usuario_id).nombre}`);
  console.log(`   Fecha     : ${new Date().toLocaleDateString("es-AR")}`);
  console.log(`   Estado    : ${orden.estado_compra}`);
  console.log(`   Items     : ${orden.DetalleOrden.length}`);
  console.log(
    `   Total     : $${orden.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
  );

  return orden;
}