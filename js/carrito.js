//variables globales
let btnProducts = document.querySelectorAll(".btn-product");
let contadorCarrito = document.querySelector(".contar-pro");
let listadoCarrito = document.querySelector(".list-cart tbody");
let iconCart = document.querySelector(".carrito");
let listCart = document.querySelector(".list-cart");
let con = 0;

document.addEventListener("DOMContentLoaded", () => {
    cargarProLocalStorage();
    actualizarContadorUI();
});

btnProducts.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        infoProducto(i);
    });
});

if (iconCart) {
    iconCart.addEventListener("click", () => {
        if (listCart) {
            listCart.classList.toggle("ocultar");
        }
    });
}

function agregarProducto(producto) {
    if (!listadoCarrito) return;
    let numeroFila = listadoCarrito.rows.length + 1;
    let fila = document.createElement("tr");
    
    fila.innerHTML = `
        <td> ${numeroFila} </td>
        <td> <img src="${producto.imagen}" width="70px"> </td>
        <td> ${producto.nombre} </td>
        <td> $ ${producto.precio} </td>
        <td><span onclick="eliminarProducto(${numeroFila - 1})" class="btn btn-danger"> X </span></td>
    `;
    listadoCarrito.appendChild(fila);
}

function infoProducto(pos) {
    let producto = btnProducts[pos].parentElement.parentElement.parentElement;
    let precioTexto = producto.querySelector("h5").textContent.split("$")[1].trim();
    
    let infoPro = {
        nombre: producto.querySelector("h3").textContent,
        imagen: producto.querySelector("img").src,
        precio: precioTexto,
        cantidad: 1
    };

    guardarProLocalStorage(infoPro);
    // Limpiar tabla flotante y recargarla para evitar duplicar DOM
    if (listadoCarrito) listadoCarrito.innerHTML = "";
    cargarProLocalStorage();
    actualizarContadorUI();
}

function eliminarProducto(pos) {    
    eliminarProLocalStorage(pos);
    if (listadoCarrito) listadoCarrito.innerHTML = "";
    cargarProLocalStorage();
    actualizarContadorUI();
}

function actualizarNumeracion() {
    if (!listadoCarrito) return;
    let filas = listadoCarrito.querySelectorAll("tr");
    filas.forEach((fila, index) => {
        let celdaNumero = fila.querySelector("td:first-child");
        let botonEliminar = fila.querySelector(".btn-danger");
        if (celdaNumero) {
            celdaNumero.textContent = index + 1;
        }
        if (botonEliminar) {
            botonEliminar.setAttribute("onclick", `eliminarProducto(${index})`);
        }
    });
}

function guardarProLocalStorage(producto) {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.push(producto);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
}

function eliminarProLocalStorage(pos) {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.splice(pos, 1);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
}

function cargarProLocalStorage() {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.forEach((producto) => {
        agregarProducto(producto);
    });
    actualizarNumeracion();
}

function actualizarContadorUI() {
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    let totalItems = 0;
    if (productosPrevios != null) {
        totalItems = Object.values(productosPrevios).length;
    }
    if (contadorCarrito) {
        contadorCarrito.textContent = totalItems;
    }
}
