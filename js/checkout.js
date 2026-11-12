document.addEventListener("DOMContentLoaded", () => {
    cargarResumenCheckout();
    let formCheckout = document.getElementById("form-checkout");
    if (formCheckout) {
        formCheckout.addEventListener("submit", (e) => {
            e.preventDefault();

            // 1. Capturar datos del cliente
            let nombres = document.getElementById("nombres-input").value;
            let apellidos = document.getElementById("apellidos-input").value;
            let email = document.getElementById("email-input").value;
            let celular = document.getElementById("celular-input").value;
            let direccion = document.getElementById("direccion-input").value;

            // 2. Obtener productos y destino
            let productosDelCarrito = JSON.parse(localStorage.getItem("pro-carrito")) || [];
            let destinoInfo = JSON.parse(localStorage.getItem("pro-destino")) || { ciudad: "Medellin", costo: 0 };

            if (productosDelCarrito.length === 0) {
                alert("El carrito está vacío.");
                return;
            }

            // 3. Calcular el subtotal limpiando signos "$" y puntos "."
            let subtotal = 0;
            productosDelCarrito.forEach(p => {
                let precioLimpio = String(p.precio).replace(/\./g, "").replace(/\$/g, "").trim();
                let precioNum = parseFloat(precioLimpio) || 0;
                let cant = parseInt(p.cantidad) || 1;
                subtotal += precioNum * cant;
            });

            let valorDomi = parseFloat(destinoInfo.costo) || 0;
            let descuento = subtotal > 0 ? 5000 : 0;
            let totalPagar = subtotal + valorDomi - descuento;
            if (totalPagar < 0) totalPagar = 0;

            // 4. Construir la orden
            let nuevaOrden = {
                id: Math.floor(1000 + Math.random() * 9000),
                cliente: `${nombres} ${apellidos}`.trim(),
                email: email,
                celular: celular,
                direccion: direccion,
                productos: productosDelCarrito,
                total: totalPagar,
                estado: "Pendiente",
                fecha: new Date().toLocaleDateString()
            };

            // 5. Guardar en el Dashboard (Llave: dash-pedidos) y en la última orden
            localStorage.setItem("pro-ultima-orden", JSON.stringify(nuevaOrden));
            
            let pedidosDash = JSON.parse(localStorage.getItem("dash-pedidos")) || [];
            pedidosDash.push(nuevaOrden);
            localStorage.setItem("dash-pedidos", JSON.stringify(pedidosDash));

            // 6. Descontar stock en el inventario (Llave: dash-productos)
            let productosDash = JSON.parse(localStorage.getItem("dash-productos")) || [];
            productosDash.forEach(prodDash => {
                productosDelCarrito.forEach(prodComprado => {
                    let nombreDash = (prodDash.nombre || prodDash.name || "").toLowerCase().trim();
                    let nombreComp = (prodComprado.nombre || prodComprado.name || "").toLowerCase().trim();
                    if (nombreDash === nombreComp) {
                        prodDash.stock -= (parseInt(prodComprado.cantidad) || 1);
                        if (prodDash.stock < 0) prodDash.stock = 0;
                    }
                });
            });
            localStorage.setItem("dash-productos", JSON.stringify(productosDash));

            // 7. Limpiar carrito y redirigir
            localStorage.removeItem("pro-carrito");
            window.location.href = "thankyou.html";
        });
    }
});

function cargarResumenCheckout() {
    let productosContainer = document.querySelector(".productos");
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let destinoInfo = JSON.parse(localStorage.getItem("pro-destino")) || { ciudad: "Medellin", costo: 0 };
    let subtotal = 0;

    if (productosContainer) productosContainer.innerHTML = "";
    
    productosPrevios.forEach(p => {
        let precioLimpio = String(p.precio).replace(/\./g, "").replace(/\$/g, "").trim();
        let precioNum = parseFloat(precioLimpio) || 0;
        let cant = parseInt(p.cantidad) || 1;
        subtotal += precioNum * cant;

        if (productosContainer) {
            let div = document.createElement("div");
            div.className = "d-flex justify-content-between mb-2";
            div.innerHTML = `<span>${p.nombre || p.name} (x${cant})</span> <span>$${(precioNum * cant).toLocaleString("es-CO")}</span>`;
            productosContainer.appendChild(div);
        }
    });

    let valorDomi = parseFloat(destinoInfo.costo) || 0;
    let descuento = subtotal > 0 ? 5000 : 0;
    let total = subtotal + valorDomi - descuento;
    if (total < 0) total = 0;

    let subtotalElem = document.querySelector(".res-sub-total");
    let domiElem = document.querySelector(".valor-domi");
    let destinoElem = document.querySelector(".destino");
    let promoElem = document.querySelector(".promo");
    let totalElem = document.querySelector(".total");

    if (subtotalElem) subtotalElem.textContent = "$" + subtotal.toLocaleString("es-CO");
    if (domiElem) domiElem.textContent = "$" + valorDomi.toLocaleString("es-CO");
    if (destinoElem) destinoElem.textContent = destinoInfo.ciudad;
    if (promoElem) promoElem.textContent = "-$" + descuento.toLocaleString("es-CO");
    if (totalElem) totalElem.textContent = "$" + total.toLocaleString("es-CO");
}