// Gestión del catálogo de productos

// Variables globales
let productos = [];
let clientes = [];
let margenUsuario = 0;

// Cargar datos iniciales
async function inicializarCatalogo() {
    try {
        await Promise.all([
            cargarProductos(),
            cargarClientes()
        ]);
        
        // Obtener margen del usuario actual
        obtenerMargenUsuario();
        
        // Mostrar productos
        mostrarProductos();
        
    } catch (error) {
        console.error('Error al inicializar catálogo:', error);
    }
}

// Cargar productos desde JSON
async function cargarProductos() {
    try {
        const response = await fetch('../data/productos.json');
        if (!response.ok) throw new Error('No se pudieron cargar los productos');
        productos = await response.json();
        console.log('Productos cargados:', productos);
    } catch (error) {
        console.error('Error cargando productos:', error);
        // Productos de ejemplo si falla la carga
        productos = [
            {
                id: 1,
                nombre: "Producto de Ejemplo",
                imagen: "https://via.placeholder.com/300x200?text=Producto+1",
                descripcion: "Este es un producto de ejemplo",
                precioBase: 100
            }
        ];
    }
}

// Cargar configuración de clientes desde JSON
async function cargarClientes() {
    try {
        const response = await fetch('../data/clientes.json');
        if (!response.ok) throw new Error('No se pudieron cargar los clientes');
        clientes = await response.json();
        console.log('Clientes cargados:', clientes);
    } catch (error) {
        console.error('Error cargando clientes:', error);
        // Configuración por defecto
        clientes = {
            "default": { margen: 0 }
        };
    }
}

// Obtener margen del usuario actual
function obtenerMargenUsuario() {
    const user = getCurrentUser();
    if (!user) {
        margenUsuario = 0;
        return;
    }
    
    const email = user.email;
    
    // Buscar el cliente por email
    const clienteConfig = clientes[email] || clientes['default'] || { margen: 0 };
    margenUsuario = clienteConfig.margen || 0;
    
    console.log(`Margen del usuario ${email}: ${margenUsuario}%`);
}

// Calcular precio final con margen
function calcularPrecioFinal(precioBase) {
    return precioBase * (1 + margenUsuario / 100);
}

// Mostrar productos en el grid
function mostrarProductos() {
    const productosGrid = document.getElementById('productos-grid');
    if (!productosGrid) return;
    
    productosGrid.innerHTML = '';
    
    productos.forEach(producto => {
        const precioFinal = calcularPrecioFinal(producto.precioBase);
        
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card';
        const esUrlImagen = producto.imagen && producto.imagen.startsWith('http');
        
        productoCard.innerHTML = `
            ${esUrlImagen ? `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen" 
                     style="width: 100%; height: 200px; object-fit: contain; border-radius: 5px; margin-bottom: 15px; background: #f8f9fa;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="imagen-placeholder" style="display: none; width: 100%; height: 200px; background: #f8f9fa; border-radius: 5px; align-items: center; justify-content: center; color: #666; font-size: 16px; margin-bottom: 15px; border: 2px dashed #ddd;">
                    📦 ${producto.codigo || 'Sin imagen'}
                </div>
            ` : `
                <div class="imagen-placeholder" style="width: 100%; height: 200px; background: #f8f9fa; border-radius: 5px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 16px; margin-bottom: 15px; border: 2px dashed #ddd;">
                    📦 ${producto.codigo || 'Sin imagen'}
                </div>
            `}
            <h3 class="producto-nombre">${producto.nombre}</h3>
            <p class="producto-descripcion">${producto.descripcion}</p>
            <div class="producto-precio">$${precioFinal.toFixed(2)}</div>
            ${margenUsuario > 0 ? `<small style="color: #666;">(Precio base: $${producto.precioBase.toFixed(2)} + ${margenUsuario}%)</small>` : ''}
            <div style="margin-top: 15px;">
                <label for="cantidad-${producto.id}">Cantidad:</label>
                <input type="number" id="cantidad-${producto.id}" class="cantidad-input" value="1" min="1" max="99">
                <button onclick="agregarAlCarrito(${producto.id})" class="btn-primary" style="margin-left: 10px;">
                    Agregar al Carrito
                </button>
            </div>
        `;
        
        productosGrid.appendChild(productoCard);
    });
}

// Agregar producto al carrito
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    const cantidadInput = document.getElementById(`cantidad-${productoId}`);
    const cantidad = parseInt(cantidadInput.value) || 1;
    
    if (cantidad <= 0) {
        alert('La cantidad debe ser mayor a 0');
        return;
    }
    
    const precioFinal = calcularPrecioFinal(producto.precioBase);
    
    const item = {
        id: producto.id,
        nombre: producto.nombre,
        precio: precioFinal,
        cantidad: cantidad,
        subtotal: precioFinal * cantidad
    };
    
    // Agregar al carrito (función del carrito.js)
    if (typeof addToCart === 'function') {
        addToCart(item);
    }
    
    // Resetear cantidad
    cantidadInput.value = 1;
    
    // Mostrar mensaje de confirmación
    mostrarMensajeTemp(`${producto.nombre} agregado al carrito`);
}

// Mostrar mensaje temporal
function mostrarMensajeTemp(mensaje) {
    // Crear elemento de mensaje si no existe
    let mensajeElement = document.getElementById('mensaje-temp');
    if (!mensajeElement) {
        mensajeElement = document.createElement('div');
        mensajeElement.id = 'mensaje-temp';
        mensajeElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(mensajeElement);
    }
    
    mensajeElement.textContent = mensaje;
    mensajeElement.style.opacity = '1';
    
    // Ocultar después de 2 segundos
    setTimeout(() => {
        mensajeElement.style.opacity = '0';
    }, 2000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si estamos en la página del catálogo
    if (window.location.pathname.includes('catalogo.html')) {
        // Esperar a que Firebase Auth esté listo
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                inicializarCatalogo();
            }
        });
    }
}); 