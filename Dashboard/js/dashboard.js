// ==========================================
// DASHBOARD.JS - GESTIÓN DE PRODUCTOS Y PEDIDOS
// ==========================================

// 1. GESTIÓN DE ROLES Y SESIÓN
function obtenerRolActual() {
    return localStorage.getItem("rolUsuario") || "admin";
}

function verificarPermiso(accion) {
    let rol = obtenerRolActual();
    if (rol === "vendedor" && (accion === "eliminar" || accion === "crear")) {
        alert("⚠️ Acceso denegado: El rol de Vendedor no tiene permisos para realizar esta acción.");
        return false;
    }
    return true;
}

// 2. FUNCIONES DE LOCALSTORAGE PARA PRODUCTOS (Llave unificada: dash-productos)
function obtenerProductos() {
    let guardados = localStorage.getItem("dash-productos");
    if (!guardados) {
        let iniciales = [
            { id: 1, nombre: "Italian Burger", categoria: "Hamburguesas", precio: 25000, stock: 15 },
            { id: 2, nombre: "Chicken Burger", categoria: "Hamburguesas", precio: 22000, stock: 20 }
        ];
        localStorage.setItem("dash-productos", JSON.stringify(iniciales));
        return iniciales;
    }
    return JSON.parse(guardados);
}

function guardarProductos(productos) {
    localStorage.setItem("dash-productos", JSON.stringify(productos));
}

// 3. RENDERIZAR TABLA DE PRODUCTOS
function renderizarProductos() {
    const tbody = document.querySelector("#tabla-productos-body");
    if (!tbody) return;

    let productos = obtenerProductos();
    tbody.innerHTML = "";

    productos.forEach(prod => {
        tbody.innerHTML += `
            <tr>
                <td>${prod.id}</td>
                <td>${prod.nombre}</td>
                <td>${prod.categoria || "General"}</td>
                <td>$${Number(prod.precio).toLocaleString("es-CO")}</td>
                <td>${prod.stock} unidades</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarProducto(${prod.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${prod.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function eliminarProducto(id) {
    if (!verificarPermiso("eliminar")) return;
    let productos = obtenerProductos().filter(p => p.id !== id);
    guardarProductos(productos);
    alert("✅ Producto eliminado con éxito.");
    renderizarProductos();
}

function editarProducto(id) {
    let productos = obtenerProductos();
    let prod = productos.find(p => p.id === id);
    if (!prod) return;

    let nuevoPrecio = prompt(`Editar precio para ${prod.nombre}:`, prod.precio);
    if (nuevoPrecio !== null && !isNaN(nuevoPrecio)) {
        prod.precio = parseFloat(nuevoPrecio);
        guardarProductos(productos);
        renderizarProductos();
        alert("✅ Producto actualizado correctamente.");
    }
}

// 4. MÓDULO DE PEDIDOS (Compatible con #tabla-pedidos y #tabla-pedidos-body)
function renderizarPedidos() {
    const tbodyPedidos = document.querySelector("#tabla-pedidos") || document.querySelector("#tabla-pedidos-body");
    if (!tbodyPedidos) return;

    let pedidos = JSON.parse(localStorage.getItem("dash-pedidos")) || [];
    tbodyPedidos.innerHTML = "";

    if (pedidos.length === 0) {
        tbodyPedidos.innerHTML = `<tr><td colspan="7" class="text-center">No hay pedidos registrados aún.</td></tr>`;
        return;
    }

    pedidos.forEach(pedido => {
        let idOrden = pedido.id || pedido.numeroOrden;
        let badgeClase = pedido.estado === "Completado" ? "badge-success" : "badge-warning";

        tbodyPedidos.innerHTML += `
            <tr>
                <td>#${idOrden}</td>
                <td>${pedido.cliente}</td>
                <td>${pedido.email || "Sin correo"}</td>
                <td>${pedido.fecha || "Reciente"}</td>
                <td>$${Number(pedido.total).toLocaleString("es-CO")}</td>
                <td><span class="badge ${badgeClase}">${pedido.estado || "Pendiente"}</span></td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="verDetallePedido(${idOrden})">Ver Detalles</button>
                    <button class="btn btn-success btn-sm" onclick="cambiarEstadoPedido(${idOrden})">Completar</button>
                </td>
            </tr>
        `;
    });
}

function verDetallePedido(idPedido) {
    let pedidos = JSON.parse(localStorage.getItem("dash-pedidos")) || [];
    let pedido = pedidos.find(p => (p.id === idPedido || p.numeroOrden === idPedido));
    if (!pedido) return;

    let detalleTexto = `📦 Detalle de la Orden #${idPedido}\n`;
    detalleTexto += `Cliente: ${pedido.cliente}\n`;
    detalleTexto += `Email: ${pedido.email || "No registrado"}\n`;
    detalleTexto += `Dirección: ${pedido.direccion || "No especificada"}\n`;
    detalleTexto += `Celular: ${pedido.celular || "No especificado"}\n\n`;
    detalleTexto += `Productos:\n`;

    pedido.productos.forEach(prod => {
        let cant = prod.cantidad || 1;
        detalleTexto += `- ${prod.nombre || prod.name} (x${cant}) - $${prod.precio}\n`;
    });

    alert(detalleTexto);
}

function cambiarEstadoPedido(idPedido) {
    let pedidos = JSON.parse(localStorage.getItem("dash-pedidos")) || [];
    let pedido = pedidos.find(p => (p.id === idPedido || p.numeroOrden === idPedido));

    if (pedido) {
        pedido.estado = "Completado";
        localStorage.setItem("dash-pedidos", JSON.stringify(pedidos));
        alert(`✅ El pedido #${idPedido} ha sido marcado como Completado.`);
        renderizarPedidos();
    }
}

// 5. INICIALIZACIÓN GLOBAL
document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos();
    renderizarPedidos();
});