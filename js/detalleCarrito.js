let tablaCarrito = document.querySelector(".cart-table tbody");
let subTotalElem = document.querySelector(".res-sub-total");
let valorDomiElem = document.querySelector(".valor-domi");
let promoElem = document.querySelector(".promo");
let totalElem = document.querySelector(".total");
let selectDestino = document.querySelector(".destino");
let btnIrPagar = document.getElementById("btn-ir-pagar");

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    if (selectDestino) {
        selectDestino.addEventListener("change", calcularTotales);
    }
    if (btnIrPagar) {
        btnIrPagar.addEventListener("click", () => {
            let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
            if (!productosPrevios || productosPrevios.length === 0) {
                alert("El carrito está vacío. Agrega productos antes de pagar.");
                return;
            }
            // Guardar el destino seleccionado en localStorage para usarlo en checkout
            let ciudadSeleccionada = selectDestino ? selectDestino.value : "Medellin";
            let costoDomi = obtenerCostoDomicilio(ciudadSeleccionada);
            localStorage.setItem("pro-destino", JSON.stringify({ ciudad: ciudadSeleccionada, costo: costoDomi }));
            
            window.location.href = "checkout.html";
        });
    }
});

function obtenerCostoDomicilio(ciudad) {
    const tarifas = {
        "Medellin": 0,
        "Bello": 10000,
        "Itagui": 15000,
        "Envigado": 15000,
        "Sabaneta": 15000,
        "La Estrella": 20000,
        "Caldas": 20000,
        "Copacabana": 20000
    };
    return tarifas[ciudad] !== undefined ? tarifas[ciudad] : 0;
}

function cargarProductos() {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    
    if (!tablaCarrito) return;
    tablaCarrito.innerHTML = ""; 

    if (todosProductos.length !== 0) {
        todosProductos.forEach((producto, i) => {
            let precioNum = parseFloat(producto.precio.replace(/\./g, "").replace("$", "")) || 0;
            let cantidad = producto.cantidad || 1;
            let subtotalFila = precioNum * cantidad;

            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td class="d-flex justify-content-start align-items-center gap-3">
                    <span onclick="eliminarDelCarrito(${i})" class="btn btn-danger btn-sm"> X </span>
                    <img src="${producto.imagen}" width="70px" class="rounded">
                    <span>${producto.nombre}</span>
                </td>
                <td>$${precioNum.toLocaleString("es-CO")}</td>
                <td>
                    <div class="quantity quantity-wrap">
                        <div class="decrement" onclick="actualizarCantidad(${i}, -1)"><i class="fa-solid fa-minus"></i></div>
                        <input class="text-center" type="number" name="quantity" value="${cantidad}" readonly>
                        <div class="increment" onclick="actualizarCantidad(${i}, 1)"><i class="fa-solid fa-plus"></i></div>
                    </div>
                </td>
                <td>$${subtotalFila.toLocaleString("es-CO")}</td>
            `;
            tablaCarrito.appendChild(fila);
        });
    } else {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td colspan="4" class="text-center py-4 fs-4">
                No hay productos en el Carrito
            </td>
        `;
        tablaCarrito.appendChild(fila);
    } 

    calcularTotales();
}

function actualizarCantidad(pos, cambio) {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    if (todosProductos[pos]) {
        todosProductos[pos].cantidad = (todosProductos[pos].cantidad || 1) + cambio;
        if (todosProductos[pos].cantidad < 1) {
            todosProductos[pos].cantidad = 1;
        }
    }
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
    cargarProductos();
}

function eliminarDelCarrito(pos) {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.splice(pos, 1);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
    cargarProductos();
}

function calcularTotales() {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }

    let subtotal = 0;
    todosProductos.forEach(p => {
        let precioNum = parseFloat(p.precio.replace(/\./g, "").replace("$", "")) || 0;
        let cant = p.cantidad || 1;
        subtotal += precioNum * cant;
    });

    let ciudad = selectDestino ? selectDestino.value : "Medellin";
    let valorDomi = obtenerCostoDomicilio(ciudad);
    let descuento = subtotal > 0 ? 5000 : 0;
    if (subtotal === 0) valorDomi = 0;

    let total = subtotal + valorDomi - descuento;
    if (total < 0) total = 0;

    if (subTotalElem) subTotalElem.textContent = "$" + subtotal.toLocaleString("es-CO");
    if (valorDomiElem) valorDomiElem.textContent = "$" + valorDomi.toLocaleString("es-CO");
    if (promoElem) promoElem.textContent = "-$" + descuento.toLocaleString("es-CO");
    if (totalElem) totalElem.textContent = "$" + total.toLocaleString("es-CO");
}
