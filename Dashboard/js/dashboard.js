// ==========================================
// DASHBOARD.JS - GESTIÓN DE PRODUCTOS, PEDIDOS Y CLIENTES
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
        let nombreProd = prod.nombre || prod.name || "Producto";
        detalleTexto += `- ${nombreProd} (x${cant}) - $${prod.precio}\n`;
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

// 5. MÓDULO DE CLIENTES (Actualizado con los IDs de tu HTML)
function renderizarClientes() {
    const tbodyClientes = document.querySelector("#tabla-clientes");
    if (!tbodyClientes) return;

    let clientes = JSON.parse(localStorage.getItem("dash-clientes")) || [];
    tbodyClientes.innerHTML = "";

    if (clientes.length === 0) {
        tbodyClientes.innerHTML = `<tr><td colspan="7" class="text-center">No hay clientes registrados aún.</td></tr>`;
        return;
    }

    clientes.forEach(cli => {
        let partesNombre = (cli.nombre || "").split(" ");
        let primerNombre = partesNombre[0] || "";
        let apellido = partesNombre.slice(1).join(" ") || "N/A";

        tbodyClientes.innerHTML += `
            <tr>
                <td>#${cli.id}</td>
                <td>${primerNombre}</td>
                <td>${apellido}</td>
                <td>${cli.email}</td>
                <td>${cli.celular || "N/A"}</td>
                <td>${cli.direccion || "N/A"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarCliente(${cli.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cli.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function eliminarCliente(id) {
    let clientes = JSON.parse(localStorage.getItem("dash-clientes")) || [];
    clientes = clientes.filter(c => c.id !== id);
    localStorage.setItem("dash-clientes", JSON.stringify(clientes));
    alert("✅ Cliente eliminado con éxito.");
    renderizarClientes();
}

function editarCliente(id) {
    let clientes = JSON.parse(localStorage.getItem("dash-clientes")) || [];
    let cli = clientes.find(c => c.id === id);
    if (!cli) return;

    let nuevoNombre = prompt(`Editar nombre para el cliente:`, cli.nombre);
    let nuevoEmail = prompt(`Editar email para el cliente:`, cli.email);
    let nuevoCelular = prompt(`Editar celular para el cliente:`, cli.celular || "");
    let nuevaDireccion = prompt(`Editar dirección para el cliente:`, cli.direccion || "");

    if (nuevoNombre !== null && nuevoEmail !== null) {
        cli.nombre = nuevoNombre.trim();
        cli.email = nuevoEmail.trim();
        cli.celular = nuevoCelular ? nuevoCelular.trim() : cli.celular;
        cli.direccion = nuevaDireccion ? nuevaDireccion.trim() : cli.direccion;

        localStorage.setItem("dash-clientes", JSON.stringify(clientes));
        renderizarClientes();
        alert("✅ Cliente actualizado correctamente.");
    }
}

// 6. INICIALIZACIÓN GLOBAL
document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos();
    renderizarPedidos();
    renderizarClientes();
    cargarSelectClientes();

    // Capturar el formulario usando el ID correcto de tu HTML: "formulario-cliente"
    let formCliente = document.getElementById("formulario-cliente");
    if (formCliente) {
        formCliente.addEventListener("submit", (e) => {
            e.preventDefault();

            let nombreCompleto = document.getElementById("nombre-cli").value + " " + document.getElementById("apellido-cli").value;

            let nuevoCliente = {
                id: Math.floor(1000 + Math.random() * 9000),
                nombre: nombreCompleto.trim(),
                email: document.getElementById("email-cli").value,
                celular: document.getElementById("celular-cli").value,
                direccion: document.getElementById("direccion-cli").value
            };

            let clientes = JSON.parse(localStorage.getItem("dash-clientes")) || [];
            clientes.push(nuevoCliente);
            localStorage.setItem("dash-clientes", JSON.stringify(clientes));

            alert("✅ Cliente registrado exitosamente.");
            window.location.href = "listado-clientes.html";
        });
    }
});


// ==========================================
// MÓDULO DE CREACIÓN Y GESTIÓN DE PRODUCTOS
// ==========================================

const imagenesProductos = [
    { name: "Hamburguesa", precio: 30000, url: "https://th.bing.com/th/id/R.c691ed37c9ce3040c3ebd2892e88870c?rik=QUBcFflN%2b9oqPQ&pid=ImgRaw&r=0" },
    { name: "Pizza", precio: 45000, url: "https://www.ocu.org/-/media/ocu/images/home/alimentacion/alimentos/pizzas_selector_1600x900.jpg?rev=6a81e278-07fc-4e95-9ba1-361063f35adf&hash=B8B1264AB6FC3F4B1AE140EB390208CD" },
    { name: "Pasta", precio: 25000, url: "https://cdn.shopify.com/s/files/1/2538/5286/products/Spaghetti-with-Meat-Sauce-Recipe-1-1200_787x787.jpg?v=1588772697" },
    { name: "Perro", precio: 22000, url: "https://th.bing.com/th/id/OIP.2QjcuwsTimAImo8WSQdTdAHaFp?rs=1&pid=ImgDetMain" },
    { name: "Burrito", precio: 25000, url: "https://th.bing.com/th/id/R.1a7d6f0af7be590eb4e27d96ce3530e5?rik=eiCcb%2f%2b9TYNzXQ&pid=ImgRaw&r=0" },
    { name: "Tacos", precio: 26000, url: "https://th.bing.com/th/id/R.d50b293e5d2de51d349691db78f71f8c?rik=FfttXcgxjuqR%2fQ&pid=ImgRaw&r=0" },
    { name: "Pollo", precio: 35000, url: "https://th.bing.com/th/id/OIP.IAza-1yPPvzA55qlI0VqvQHaF7?w=744&h=595&rs=1&pid=ImgDetMain" },
    { name: "Chuzo", precio: 22000, url: "https://th.bing.com/th/id/R.c0d3de5bd13edcc5323d074e4ba8f864?rik=lFbTsZF0ESAN5w&pid=ImgRaw&r=0" },
    { name: "Sanchipapa", precio: 20000, url: "https://1.bp.blogspot.com/-6lKIIVq3CXw/WK8raCAD-gI/AAAAAAABMnI/5VoCplTPogASfSZS5XzIFZizMBZ8yO8bQCLcB/s1600/salchipapa%2Bcolombiana.png" },
    { name: "Picada", precio: 65000, url: "https://cdn.colombia.com/gastronomia/2016/06/21/picada-colombiana-2990.jpg" }
];

document.addEventListener("DOMContentLoaded", () => {
    let selectImagen = document.querySelector('#productos-select');
    let imagenMostrada = document.querySelector('#imagen-pro');
    let precioInput = document.querySelector("#precio-pro");

    if (selectImagen) {
        selectImagen.addEventListener('change', () => {
            const imgSel = imagenesProductos.find(img => img.name === selectImagen.value);
            if (imgSel) {
                if (imagenMostrada) {
                    imagenMostrada.src = imgSel.url;
                    imagenMostrada.alt = imgSel.name;
                }
                if (precioInput) {
                    precioInput.value = imgSel.precio;
                }
            }
        });
    }

    let btnCrearProducto = document.querySelector("#btn-crear-producto");
    if (btnCrearProducto) {
        btnCrearProducto.addEventListener("click", () => {
            let tipoProducto = selectImagen ? selectImagen.value : "";
            let precio = precioInput ? parseFloat(precioInput.value) || 0 : 0;
            let stockInput = document.querySelector("#stock-pro");
            let descInput = document.querySelector("#form6Example7");

            let stock = stockInput ? parseInt(stockInput.value) || 0 : 0;
            let descripcion = descInput ? descInput.value : "";

            if (!tipoProducto || tipoProducto === "Seleccionar un producto") {
                alert("⚠️ Por favor selecciona un producto válido.");
                return;
            }

            let nuevoProducto = {
                id: Date.now(),
                nombre: tipoProducto,
                categoria: "Comidas Rápidas",
                precio: precio,
                stock: stock,
                descripcion: descripcion
            };

            let productos = obtenerProductos();
            productos.push(nuevoProducto);
            guardarProductos(productos);

            alert("✅ ¡Producto creado y guardado en el inventario con éxito!");
            window.location.href = "listado-pro.html";
        });
    }
});

function cargarSelectClientes() {
    const selectCliente = document.getElementById("id_cliente");
    if (!selectCliente) return;

    let clientes = JSON.parse(localStorage.getItem("dash-clientes")) || [];
    
    // Limpiar opciones previas manteniendo la opción por defecto
    selectCliente.innerHTML = `<option selected disabled>Seleccionar Cliente</option>`;

    clientes.forEach(cli => {
        selectCliente.innerHTML += `
            <option value="${cli.id}">${cli.nombre} - ${cli.email}</option>
        `;
    });
}
let formPedido = document.getElementById("formulario-pedido");
if (formPedido) {
    formPedido.addEventListener("submit", (e) => {
        e.preventDefault();

        let clienteId = document.getElementById("id_cliente").value;
        let metodoPago = document.getElementById("metodo_pago").value;
        let descuento = parseFloat(document.getElementById("descuento").value) || 0;
        let aumento = parseFloat(document.getElementById("aumento").value) || 0;

        if (!clienteId || clienteId === "Seleccionar Cliente") {
            alert("⚠️ Por favor selecciona un cliente para el pedido.");
            return;
        }

        let nuevoPedido = {
            id: Date.now(),
            clienteId: clienteId,
            metodoPago: metodoPago,
            descuento: descuento,
            aumento: aumento,
            estado: "Pendiente",
            fecha: new Date().toLocaleDateString()
        };

        let pedidos = JSON.parse(localStorage.getItem("dash-pedidos")) || [];
        pedidos.push(nuevoPedido);
        localStorage.setItem("dash-pedidos", JSON.stringify(pedidos));

        alert("✅ ¡Pedido creado exitosamente!");
        window.location.href = "listado-pedidos.html";
    });
}
