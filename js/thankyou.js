document.addEventListener("DOMContentLoaded", () => {
    let ultimaOrden = JSON.parse(localStorage.getItem("pro-ultima-orden"));

    if (ultimaOrden) {
        let clienteElem = document.getElementById("cliente-nombre");
        let ordenElem = document.getElementById("orden-numero");
        let detallesElem = document.getElementById("thankyou-detalles");
        let totalElem = document.getElementById("thankyou-total");

        if (clienteElem) clienteElem.textContent = `¡${ultimaOrden.cliente}!`;
        if (ordenElem) ordenElem.textContent = `Orden #${ultimaOrden.numeroOrden}`;

        let html = `<p><strong>Dirección de entrega:</strong> ${ultimaOrden.direccion}</p>`;
        html += `<p><strong>Teléfono:</strong> ${ultimaOrden.celular}</p><hr><ul>`;

        let subtotal = 0;
        ultimaOrden.productos.forEach(p => {
            let precioNum = parseFloat(p.precio.replace(/\./g, "").replace("$", "")) || 0;
            let cant = p.cantidad || 1;
            subtotal += precioNum * cant;
            html += `<li>${p.nombre} - Cantidad: ${cant} - $${(precioNum * cant).toLocaleString("es-CO")}</li>`;
        });
        html += `</ul>`;

        let valorDomi = ultimaOrden.destino.costo || 0;
        let descuento = subtotal > 0 ? 5000 : 0;
        let total = subtotal + valorDomi - descuento;
        if (total < 0) total = 0;

        if (detallesElem) detallesElem.innerHTML = html;
        if (totalElem) totalElem.textContent = `Total pagado: $${total.toLocaleString("es-CO")}`;
    }

    let btnOtraCompra = document.getElementById("btn-otra-compra");
    if (btnOtraCompra) {
        btnOtraCompra.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});
