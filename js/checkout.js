document.addEventListener("DOMContentLoaded", () => {
    cargarResumenCheckout();

    let formCheckout = document.getElementById("form-checkout");
    if (formCheckout) {
        formCheckout.addEventListener("submit", (e) => {
            e.preventDefault();

            let nombres = document.getElementById("nombres-input").value;
            let apellidos = document.getElementById("apellidos-input").value;
            let email = document.getElementById("email-input").value;
            let celular = document.getElementById("celular-input").value;
            let direccion = document.getElementById("direccion-input").value;

            let ordenInfo = {
                cliente: `${nombres} ${apellidos}`,
                email: email,
                celular: celular,
                direccion: direccion,
                numeroOrden: Math.floor(1000 + Math.random() * 9000),
                productos: JSON.parse(localStorage.getItem("pro-carrito")) || [],
                destino: JSON.parse(localStorage.getItem("pro-destino")) || { ciudad: "Medellin", costo: 0 }
            };

            localStorage.setItem("pro-ultima-orden", JSON.stringify(ordenInfo));
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
        let precioNum = parseFloat(p.precio.replace(/\./g, "").replace("$", "")) || 0;
        let cant = p.cantidad || 1;
        subtotal += precioNum * cant;

        if (productosContainer) {
            let div = document.createElement("div");
            div.className = "d-flex justify-content-between mb-2";
            div.innerHTML = `<span>${p.nombre} (x${cant})</span> <span>$${(precioNum * cant).toLocaleString("es-CO")}</span>`;
            productosContainer.appendChild(div);
        }
    });

    let valorDomi = destinoInfo.costo;
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
