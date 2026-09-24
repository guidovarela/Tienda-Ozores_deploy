import { fetchMyOrders, formatArsCurrency, getFriendlyRoleLabel, getStoredUser, logoutSession } from "./shared.js";

const user = getStoredUser();

if (!user) {
  window.location.replace("login.html");
}

function setProfileInfo() {
  document.getElementById("profile-name").textContent = user.nombre ?? "Usuario";
  document.getElementById("profile-email").textContent = user.email ?? "";
  document.getElementById("profile-role").textContent = getFriendlyRoleLabel(user) || "cliente";
}

function renderOrders(orders = []) {
  const emptyState = document.getElementById("orders-empty-state");
  const list = document.getElementById("orders-list");

  if (!orders.length) {
    emptyState.classList.remove("d-none");
    list.innerHTML = "";
    return;
  }

  emptyState.classList.add("d-none");
  list.innerHTML = orders
    .map((order) => {
      const orderDate = String(order.fecha_compra ?? "").slice(0, 10);
      const couponLabel = order.cupon?.nombre ? `Cupón: ${order.cupon.nombre}` : "Sin cupón";
      const details = Array.isArray(order.detalles) ? order.detalles : [];

      return `
        <article class="border rounded-3 p-3 bg-white">
          <div class="d-flex flex-column flex-sm-row justify-content-between gap-2 mb-3">
            <div>
              <div class="fw-semibold">Orden #${order.id_orden}</div>
              <div class="small text-muted">${orderDate}</div>
            </div>
            <div class="text-sm-end">
              <div class="fw-semibold">${formatArsCurrency(order.total ?? 0)}</div>
              <div class="small text-muted">${couponLabel}</div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Producto</th>
                  <th class="text-center">Cantidad</th>
                  <th class="text-end">Precio unitario</th>
                  <th class="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${details
                  .map((detail) => {
                    const productName = detail.producto?.nombre ?? "Producto eliminado";
                    const quantity = Number(detail.cantidad ?? 0);
                    const unitPrice = Number(detail.precio_unitario ?? 0);
                    const subtotal = quantity * unitPrice;

                    return `
                      <tr>
                        <td>${productName}</td>
                        <td class="text-center">${quantity}</td>
                        <td class="text-end">${formatArsCurrency(unitPrice)}</td>
                        <td class="text-end">${formatArsCurrency(subtotal)}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadOrders() {
  const orders = await fetchMyOrders();
  renderOrders(Array.isArray(orders) ? orders : []);
}

document.getElementById("logout-button").addEventListener("click", () => {
  logoutSession();
  window.location.replace("login.html");
});

setProfileInfo();
loadOrders().catch((error) => {
  const list = document.getElementById("orders-list");
  list.innerHTML = `<div class="alert alert-danger mb-0">${error.message}</div>`;
});
