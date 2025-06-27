// Gestión del catálogo de productos
console.log('Cargando script catalogo.js...');

// Variables globales
let productos = [];
let clientes = [];
let margenUsuario = 0;

// Función de prueba inmediata
function probarElementos() {
    console.log('Probando elementos del DOM...');
    const productosGrid = document.getElementById('productos-grid');
    console.log('productos-grid encontrado:', !!productosGrid);
    if (productosGrid) {
        console.log('innerHTML actual:', productosGrid.innerHTML);
        productosGrid.innerHTML = '<div style="text-align: center; padding: 20px; background: #e7f3ff; border: 2px solid #0066cc; border-radius: 8px;"><h3 style="color: #0066cc;">🔧 Script cargado correctamente</h3><p>Inicializando catálogo...</p></div>';
    }
}

// Cargar datos iniciales
async function inicializarCatalogo() {
    console.log('Inicializando catálogo...');
    try {
        // Cargar productos primero
        await cargarProductos();
        console.log('Productos cargados:', productos.length);
        
        // Cargar clientes
        await cargarClientes();
        console.log('Clientes cargados');
        
        // Obtener margen del usuario actual
        obtenerMargenUsuario();
        
        // Mostrar productos
        mostrarProductos();
        
        console.log('Catálogo inicializado correctamente');
        
    } catch (error) {
        console.error('Error al inicializar catálogo:', error);
        // En caso de error, mostrar productos de ejemplo
        productos = [
            {
                id: 1,
                nombre: "iPhone 13 128GB - Ejemplo",
                imagen: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=300&fit=crop",
                descripcion: "Producto de ejemplo - Error al cargar datos reales",
                precioBase: 1000,
                codigo: "EJEMPLO-001"
            }
        ];
        obtenerMargenUsuario();
        mostrarProductos();
    }
}

// Cargar productos desde JSON
async function cargarProductos() {
    const posiblesRutas = [
        './data/productos.json',           // Relativa desde la página actual
        '../data/productos.json',          // Relativa desde public/
        '/data/productos.json',            // Absoluta desde raíz
        '/Carrito/data/productos.json'     // GitHub Pages
    ];
    
    for (const ruta of posiblesRutas) {
        try {
            console.log(`Intentando cargar productos desde: ${ruta}`);
            const response = await fetch(ruta);
            if (response.ok) {
                productos = await response.json();
                console.log(`Productos cargados exitosamente desde: ${ruta}`, productos.length, 'productos');
                return;
            }
        } catch (error) {
            console.log(`Error con ruta ${ruta}:`, error.message);
        }
    }
    
    // Si ninguna ruta funcionó, usar productos de ejemplo
    console.error('No se pudieron cargar los productos desde ninguna ruta');
    productos = [
        {
            id: 1,
            nombre: "iPhone 13 128GB - Ejemplo",
            imagen: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=300&fit=crop",
            descripcion: "Producto de ejemplo - Error al cargar datos reales",
            precioBase: 1000,
            codigo: "EJEMPLO-001"
        },
        {
            id: 2,
            nombre: "iPhone 14 128GB - Ejemplo",
            imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
            descripcion: "Producto de ejemplo - Error al cargar datos reales",
            precioBase: 1200,
            codigo: "EJEMPLO-002"
        }
    ];
    console.log('Usando productos de ejemplo:', productos);
}

// Cargar configuración de clientes desde JSON
async function cargarClientes() {
    const posiblesRutas = [
        './data/clientes.json',           // Relativa desde la página actual
        '../data/clientes.json',          // Relativa desde public/
        '/data/clientes.json',            // Absoluta desde raíz
        '/Carrito/data/clientes.json'     // GitHub Pages
    ];
    
    for (const ruta of posiblesRutas) {
        try {
            console.log(`Intentando cargar clientes desde: ${ruta}`);
            const response = await fetch(ruta);
            if (response.ok) {
                clientes = await response.json();
                console.log(`Clientes cargados exitosamente desde: ${ruta}`);
                return;
            }
        } catch (error) {
            console.log(`Error con ruta ${ruta}:`, error.message);
        }
    }
    
    // Si ninguna ruta funcionó, usar configuración por defecto
    console.error('No se pudieron cargar los clientes desde ninguna ruta');
    clientes = {
        "default": { margen: 0 }
    };
    console.log('Usando configuración de clientes por defecto');
}

// Obtener margen del usuario actual
function obtenerMargenUsuario() {
    // Usar getCurrentUser si está disponible, sino usar Firebase Auth directamente
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : firebase.auth().currentUser;
    
    if (!user) {
        margenUsuario = 0;
        console.log('Usuario invitado: margen 0%');
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
    console.log('Mostrando productos, cantidad:', productos.length);
    
    // Si los filtros están inicializados, usar la función con filtros
    if (typeof productosFiltrados !== 'undefined') {
        mostrarProductosConFiltros();
        return;
    }
    
    const productosGrid = document.getElementById('productos-grid');
    if (!productosGrid) {
        console.error('No se encontró el elemento productos-grid');
        return;
    }
    
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
            <p class="producto-descripcion">
                <strong>Stock:</strong> ${producto.stock > 0 ? producto.stock : 'Sin stock'}
                ${producto.transit > 0 ? ` | <strong>En tránsito:</strong> ${producto.transit}` : ''}
            </p>
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

// Variables para filtros
let productosFiltrados = [];
let filtroActual = {
    modelo: '',
    capacidad: '',
    disponibilidad: ''
};

// Aplicar filtros a los productos
function aplicarFiltros() {
    console.log('Aplicando filtros:', filtroActual);
    
    productosFiltrados = productos.filter(producto => {
        // Filtro por modelo
        if (filtroActual.modelo && !producto.categoria.includes(filtroActual.modelo)) {
            return false;
        }
        
        // Filtro por capacidad
        if (filtroActual.capacidad && !producto.descripcion.includes(filtroActual.capacidad)) {
            return false;
        }
        
        // Filtro por disponibilidad
        if (filtroActual.disponibilidad) {
            switch (filtroActual.disponibilidad) {
                case 'stock':
                    if (producto.stock <= 0) return false;
                    break;
                case 'transito':
                    if (producto.transit <= 0) return false;
                    break;
                case 'disponible':
                    if (producto.stock <= 0 && producto.transit <= 0) return false;
                    break;
            }
        }
        
        return true;
    });
    
    console.log(`Productos filtrados: ${productosFiltrados.length} de ${productos.length}`);
    mostrarProductosFiltrados();
}

// Mostrar productos filtrados
function mostrarProductosFiltrados() {
    const productosGrid = document.getElementById('productos-grid');
    if (!productosGrid) {
        console.error('No se encontró el elemento productos-grid');
        return;
    }
    
    // Mostrar información de filtros
    const productosInfo = document.getElementById('productos-info');
    if (productosInfo) {
        productosInfo.remove();
    }
    
    const infoDiv = document.createElement('div');
    infoDiv.id = 'productos-info';
    infoDiv.className = 'productos-info';
    infoDiv.textContent = `Mostrando ${productosFiltrados.length} de ${productos.length} productos`;
    productosGrid.parentNode.insertBefore(infoDiv, productosGrid);
    
    // Limpiar grid
    productosGrid.innerHTML = '';
    
    if (productosFiltrados.length === 0) {
        productosGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px; border: 2px dashed #dee2e6;">
                <h3 style="color: #6c757d; margin-bottom: 10px;">No se encontraron productos</h3>
                <p style="color: #6c757d;">Intenta ajustar los filtros para ver más productos</p>
            </div>
        `;
        return;
    }
    
    productosFiltrados.forEach(producto => {
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
            <p class="producto-descripcion">
                <strong>Stock:</strong> ${producto.stock > 0 ? producto.stock : 'Sin stock'}
                ${producto.transit > 0 ? ` | <strong>En tránsito:</strong> ${producto.transit}` : ''}
            </p>
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

// Event listeners para filtros
function inicializarFiltros() {
    const filtroModelo = document.getElementById('filtro-modelo');
    const filtroCapacidad = document.getElementById('filtro-capacidad');
    const filtroDisponibilidad = document.getElementById('filtro-disponibilidad');
    const limpiarFiltros = document.getElementById('limpiar-filtros');
    
    if (filtroModelo) {
        filtroModelo.addEventListener('change', function() {
            filtroActual.modelo = this.value;
            aplicarFiltros();
        });
    }
    
    if (filtroCapacidad) {
        filtroCapacidad.addEventListener('change', function() {
            filtroActual.capacidad = this.value;
            aplicarFiltros();
        });
    }
    
    if (filtroDisponibilidad) {
        filtroDisponibilidad.addEventListener('change', function() {
            filtroActual.disponibilidad = this.value;
            aplicarFiltros();
        });
    }
    
    if (limpiarFiltros) {
        limpiarFiltros.addEventListener('click', function() {
            // Limpiar filtros
            filtroActual = { modelo: '', capacidad: '', disponibilidad: '' };
            
            // Resetear selects
            if (filtroModelo) filtroModelo.value = '';
            if (filtroCapacidad) filtroCapacidad.value = '';
            if (filtroDisponibilidad) filtroDisponibilidad.value = '';
            
            // Mostrar todos los productos
            mostrarProductos();
        });
    }
}

// Actualizar mostrarProductos para usar filtros
function mostrarProductosConFiltros() {
    console.log('Mostrando productos con filtros, cantidad:', productos.length);
    
    // Si no hay filtros activos, mostrar todos los productos
    if (!filtroActual.modelo && !filtroActual.capacidad && !filtroActual.disponibilidad) {
        productosFiltrados = [...productos];
        mostrarProductosFiltrados();
    } else {
        aplicarFiltros();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, pathname:', window.location.pathname);
    
    // Solo inicializar si estamos en la página del catálogo
    if (window.location.pathname.includes('catalogo.html')) {
        console.log('Detectada página de catálogo, inicializando...');
        
        // Probar elementos primero
        probarElementos();
        
        // Inicializar filtros
        inicializarFiltros();
        
        // Esperar un poco y luego inicializar
        setTimeout(() => {
            inicializarCatalogo();
        }, 500);
        
        // También actualizar cuando cambie el estado de auth para recalcular márgenes
        firebase.auth().onAuthStateChanged((user) => {
            console.log('Estado de auth cambió en catálogo:', user ? 'logueado' : 'invitado');
            // Recalcular margen y actualizar precios
            obtenerMargenUsuario();
            mostrarProductosConFiltros();
        });
    } else {
        console.log('No es página de catálogo, saltando inicialización');
    }
}); 