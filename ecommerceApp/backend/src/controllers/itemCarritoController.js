import productosDb from "../../database/products_db.js";
import { ItemCarrito } from "../models/ItemCarrito.js";

function buscarProducto(id_producto) {
  const idProducto = Number(id_producto);
  return productosDb.find((producto) => producto.id_producto === idProducto);
}

function hayStockProducto(id_producto, cantidad) {
  const producto = buscarProducto(id_producto);
  return Boolean(producto && producto.stock >= cantidad);
}

function restarStockProducto(id_producto, cantidad) {
  const producto = buscarProducto(id_producto);

  if (producto) {
    producto.stock -= cantidad;
  }

  return producto;
}

function crearItemCarrito(id_carrito, id_item, id_producto, cantidad) {
  const producto = buscarProducto(id_producto);

  if (!producto) {
    console.log("No existe el producto");
    return null;
  }

  if (!hayStockProducto(id_producto, cantidad)) {
    console.log(`❌ Stock insuficiente del producto ${producto.nombre}`);
    return null;
  }

  const itemCarrito = new ItemCarrito(id_carrito, id_item, producto, cantidad);

  restarStockProducto(id_producto, cantidad);
  return itemCarrito;
}

function agregarItemCarrito(carrito, id_producto, cantidad, id_item) {
  const siguienteIdItem = id_item ?? carrito.ItemCarrito.length + 1;
  const itemCarrito = crearItemCarrito(
    carrito.id_carrito,
    siguienteIdItem,
    id_producto,
    cantidad,
  );

  if (!itemCarrito) {
    return null;
  }

  carrito.ItemCarrito.push(itemCarrito);
  return itemCarrito;
}

const itemCarritoController = {
  buscarProducto,
  hayStockProducto,
  restarStockProducto,
  crearItemCarrito,
  agregarItemCarrito,
};

export {
  buscarProducto,
  hayStockProducto,
  restarStockProducto,
  crearItemCarrito,
  agregarItemCarrito,
};

export default itemCarritoController;
