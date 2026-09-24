export class ItemCarrito {
  constructor(id_carrito, id_item, objeto_producto, cantidad) {
    this.id_carrito = id_carrito;
    this.id_item = id_item;
    this.producto_id = objeto_producto;
    this.cantidad = cantidad;
  }
}
