// Gestión del carrito de compras

// Variables globales del carrito
let carrito = [];
const CARRITO_STORAGE_KEY = 'tienda_carrito';

// Inicializar carrito desde localStorage
function inicializarCarrito() {
    const carritoGuardado = localStorage.getItem(CARRITO_STORAGE_KEY);
    if (carritoGuardado) {
        try {
            carrito = JSON.parse(carritoGuardado);
        } catch (error) {
            console.error('Error al cargar carrito desde localStorage:', error);
            carrito = [];
        }
    }
    actualizarVistaCarrito();
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
}

// Agregar item al carrito
function addToCart(item) {
    // Verificar si el usuario está logueado
    if (!isAuthenticated()) {
        mostrarModalLoginRequerido();
        return;
    }
    
    // Verificar si el producto ya existe en el carrito
    const itemExistente = carrito.find(cartItem => cartItem.id === item.id);
    
    if (itemExistente) {
        // Si existe, sumar las cantidades
        itemExistente.cantidad += item.cantidad;
        itemExistente.subtotal = itemExistente.precio * itemExistente.cantidad;
    } else {
        // Si no existe, agregar nuevo item
        carrito.push(item);
    }
    
    guardarCarrito();
    actualizarVistaCarrito();
    
    // Mostrar carrito flotante en móvil después de agregar producto
    if (window.innerWidth <= 480) {
        mostrarCarritoFlotante();
    }
}

// Eliminar item del carrito
function eliminarDelCarrito(productoId) {
    // Encontrar el item antes de eliminarlo para restaurar el stock
    const item = carrito.find(cartItem => cartItem.id === productoId);
    if (item) {
        // Restaurar stock temporal
        if (typeof restaurarStockTemporal === 'function') {
            restaurarStockTemporal(productoId, item.cantidad);
        }
        
        // Actualizar vista de productos en el catálogo si existe la función
        actualizarVistaProductos();
    }
    
    carrito = carrito.filter(item => item.id !== productoId);
    guardarCarrito();
    actualizarVistaCarrito();
}

// Actualizar cantidad de un item
function actualizarCantidad(productoId, nuevaCantidad) {
    const item = carrito.find(cartItem => cartItem.id === productoId);
    if (item) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            const cantidadAnterior = item.cantidad;
            const diferencia = nuevaCantidad - cantidadAnterior;
            
            // Si se está aumentando la cantidad, verificar stock disponible
            if (diferencia > 0 && typeof obtenerStockDisponible === 'function') {
                const stockDisponible = obtenerStockDisponible(productoId);
                if (diferencia > stockDisponible) {
                    alert(`Solo hay ${stockDisponible} unidades adicionales disponibles.`);
                    return;
                }
                // Reducir stock temporal por la diferencia
                if (typeof reducirStockTemporal === 'function') {
                    reducirStockTemporal(productoId, diferencia);
                }
            } else if (diferencia < 0) {
                // Si se está reduciendo la cantidad, restaurar stock temporal
                if (typeof restaurarStockTemporal === 'function') {
                    restaurarStockTemporal(productoId, Math.abs(diferencia));
                }
            }
            
            item.cantidad = nuevaCantidad;
            item.subtotal = item.precio * item.cantidad;
            guardarCarrito();
            actualizarVistaCarrito();
            
            // Actualizar vista de productos
            actualizarVistaProductos();
        }
    }
}

// Vaciar carrito
function limpiarCarrito() {
    // Asegurar que la ventana esté enfocada antes del confirm
    window.focus();
    
    // Usar setTimeout para asegurar que el confirm se ejecute después del focus
    setTimeout(() => {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            // Restaurar todo el stock temporal antes de limpiar
            if (typeof restaurarStockTemporal === 'function') {
                carrito.forEach(item => {
                    restaurarStockTemporal(item.id, item.cantidad);
                });
            }
            
            carrito = [];
            guardarCarrito();
            actualizarVistaCarrito();
            
            // Actualizar vista de productos
            actualizarVistaProductos();
            
            // Mostrar mensaje de confirmación
            if (typeof mostrarMensajeTemp === 'function') {
                mostrarMensajeTemp('Carrito vaciado y stock restaurado');
            }
        }
    }, 100);
}

// Calcular total del carrito
function calcularTotal() {
    return carrito.reduce((total, item) => total + item.subtotal, 0);
}

// Actualizar vista del carrito
function actualizarVistaCarrito() {
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoContenido = document.getElementById('carrito-contenido');
    const carritoItems = document.getElementById('carrito-items');
    const totalCarrito = document.getElementById('total-carrito');
    
    if (!carritoItems || !totalCarrito) return;
    
    if (carrito.length === 0) {
        // Mostrar mensaje de carrito vacío
        if (carritoVacio) carritoVacio.style.display = 'block';
        if (carritoContenido) carritoContenido.style.display = 'none';
    } else {
        // Mostrar contenido del carrito
        if (carritoVacio) carritoVacio.style.display = 'none';
        if (carritoContenido) carritoContenido.style.display = 'block';
        
        // Actualizar tabla de items
        carritoItems.innerHTML = '';
        
        carrito.forEach(item => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${item.nombre}</td>
                <td>
                    <input type="number" class="item-cantidad" value="${item.cantidad}" 
                           min="1" onchange="actualizarCantidad(${item.id}, this.value)">
                </td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">
                        Eliminar
                    </button>
                </td>
            `;
            carritoItems.appendChild(fila);
        });
        
        // Actualizar total
        totalCarrito.textContent = calcularTotal().toFixed(2);
    }
    
    // Restablecer event listeners después de actualizar el carrito
    restablecerEventListeners();
}

// Generar resumen del pedido para envío
function generarResumenPedido() {
    const user = getCurrentUser();
    const userEmail = user ? user.email : 'Usuario desconocido';
    const userName = user ? (user.displayName || user.email.split('@')[0]) : 'Usuario';
    
    let resumen = `NUEVO PEDIDO\n\n`;
    resumen += `Cliente: ${userName}\n`;
    resumen += `Email: ${userEmail}\n`;
    resumen += `Fecha: ${new Date().toLocaleString('es-ES')}\n\n`;
    resumen += `PRODUCTOS:\n`;
    resumen += `----------------------------------------\n`;
    
    carrito.forEach(item => {
        resumen += `${item.nombre}\n`;
        resumen += `  Cantidad: ${item.cantidad}\n`;
        resumen += `  Precio unitario: $${item.precio.toFixed(2)}\n`;
        resumen += `  Subtotal: $${item.subtotal.toFixed(2)}\n\n`;
    });
    
    resumen += `----------------------------------------\n`;
    resumen += `TOTAL: $${calcularTotal().toFixed(2)}\n\n`;
    resumen += `Generado desde Carrito`;
    
    return resumen;
}

// Mostrar modal de envío
function mostrarModalEnvio() {
    // Verificar si el usuario está logueado
    if (!isAuthenticated()) {
        alert('Debes iniciar sesión para realizar un pedido');
        irALogin();
        return;
    }
    
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const modal = document.getElementById('modal-pedido');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modal-pedido');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Generar link de WhatsApp
function generarLinkWhatsApp() {
    const resumen = generarResumenPedido();
    const numeroWhatsApp = '+541166251922'; // Número de WhatsApp actualizado
    const mensaje = encodeURIComponent(resumen);
    return `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
}

// Event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si estamos en la página del catálogo
    if (window.location.pathname.includes('catalogo.html')) {
        inicializarCarrito();
        
        // Event listener para limpiar carrito
        const limpiarBtn = document.getElementById('limpiar-carrito');
        if (limpiarBtn) {
            limpiarBtn.addEventListener('click', limpiarCarrito);
        }
        
        // Event listener para enviar pedido
        const enviarBtn = document.getElementById('enviar-pedido');
        if (enviarBtn) {
            enviarBtn.addEventListener('click', mostrarModalEnvio);
        }
        
        // Event listeners del modal
        const modal = document.getElementById('modal-pedido');
        const closeBtn = modal?.querySelector('.close');
        const enviarWhatsAppBtn = document.getElementById('enviar-whatsapp');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', cerrarModal);
        }
        
        if (enviarWhatsAppBtn) {
            enviarWhatsAppBtn.addEventListener('click', function() {
                const whatsappUrl = generarLinkWhatsApp();
                window.open(whatsappUrl, '_blank');
                cerrarModal();
                
                // Preguntar si quiere limpiar el carrito después de enviar el pedido
                setTimeout(() => {
                    if (confirm('¿Quieres vaciar el carrito después de enviar el pedido?')) {
                        // Limpiar stock temporal (el pedido ya se envió, así que no restauramos stock)
                        if (typeof localStorage !== 'undefined') {
                            localStorage.removeItem('tienda_stock_temporal');
                        }
                        if (typeof stockTemporal !== 'undefined') {
                            stockTemporal = {};
                        }
                        
                        carrito = [];
                        guardarCarrito();
                        actualizarVistaCarrito();
                        
                        // Actualizar vista de productos para mostrar stock original
                        actualizarVistaProductos();
                        
                        // Mostrar mensaje de confirmación
                        if (typeof mostrarMensajeTemp === 'function') {
                            mostrarMensajeTemp('Pedido enviado y carrito vaciado. Stock restaurado.');
                        }
                    }
                }, 1000);
            });
        }
        
        // Cerrar modal al hacer click fuera
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    cerrarModal();
                }
            });
        }
        
        // Event listeners para modal de login requerido
        const modalLoginRequerido = document.getElementById('modal-login-requerido');
        if (modalLoginRequerido) {
            modalLoginRequerido.addEventListener('click', function(e) {
                if (e.target === modalLoginRequerido) {
                    cerrarModalLoginRequerido();
                }
            });
        }
    }
});

// Funciones para carrito flotante en móviles
function mostrarCarritoFlotante() {
    const carritoFlotante = document.getElementById('carrito-flotante');
    if (carritoFlotante) {
        carritoFlotante.classList.add('show');
        actualizarVistaCarritoFlotante();
    }
}

function cerrarCarritoFlotante() {
    const carritoFlotante = document.getElementById('carrito-flotante');
    if (carritoFlotante) {
        carritoFlotante.classList.remove('show');
    }
}

// Actualizar vista del carrito flotante
function actualizarVistaCarritoFlotante() {
    const carritoVacioFlotante = document.getElementById('carrito-vacio-flotante');
    const carritoContenidoFlotante = document.getElementById('carrito-contenido-flotante');
    const carritoItemsFlotante = document.getElementById('carrito-items-flotante');
    const totalCarritoFlotante = document.getElementById('total-carrito-flotante');
    
    if (!carritoItemsFlotante || !totalCarritoFlotante) return;
    
    if (carrito.length === 0) {
        // Mostrar mensaje de carrito vacío
        if (carritoVacioFlotante) carritoVacioFlotante.style.display = 'block';
        if (carritoContenidoFlotante) carritoContenidoFlotante.style.display = 'none';
    } else {
        // Mostrar contenido del carrito
        if (carritoVacioFlotante) carritoVacioFlotante.style.display = 'none';
        if (carritoContenidoFlotante) carritoContenidoFlotante.style.display = 'block';
        
        // Actualizar tabla de items (versión compacta para móvil)
        carritoItemsFlotante.innerHTML = '';
        
                 carrito.forEach(item => {
             const fila = document.createElement('tr');
             fila.innerHTML = `
                 <td style="font-size: 12px;">${item.nombre.substring(0, 20)}${item.nombre.length > 20 ? '...' : ''}</td>
                 <td>
                     <input type="number" class="item-cantidad" value="${item.cantidad}" 
                            min="1" style="width: 50px; font-size: 12px;" 
                            onchange="actualizarCantidad(${item.id}, this.value)">
                 </td>
                 <td style="font-size: 12px;">$${item.precio.toFixed(2)}</td>
                 <td>
                     <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})" 
                             style="padding: 4px 8px; font-size: 12px;">
                         ❌
                     </button>
                 </td>
             `;
             carritoItemsFlotante.appendChild(fila);
         });
        
        // Actualizar total
        totalCarritoFlotante.textContent = calcularTotal().toFixed(2);
    }
    
    // Restablecer event listeners después de actualizar el carrito flotante
    restablecerEventListeners();
}

// Función para restablecer event listeners después de actualizar el carrito
function restablecerEventListeners() {
    // NO restablecer el event listener del logout aquí
    // El auth.js ya se encarga de esto y duplicarlo causa problemas
    console.log('Event listeners del carrito restablecidos (logout omitido)');
}

// Funciones para modal de login requerido
function mostrarModalLoginRequerido() {
    const modal = document.getElementById('modal-login-requerido');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function cerrarModalLoginRequerido() {
    const modal = document.getElementById('modal-login-requerido');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Event listeners adicionales para carrito flotante
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para limpiar carrito flotante
    const limpiarBtnFlotante = document.getElementById('limpiar-carrito-flotante');
    if (limpiarBtnFlotante) {
        limpiarBtnFlotante.addEventListener('click', function() {
            limpiarCarrito();
            cerrarCarritoFlotante();
        });
    }
    
    // Event listener para enviar pedido flotante
    const enviarBtnFlotante = document.getElementById('enviar-pedido-flotante');
    if (enviarBtnFlotante) {
        enviarBtnFlotante.addEventListener('click', function() {
            mostrarModalEnvio();
            cerrarCarritoFlotante();
        });
    }
});

// Función auxiliar para actualizar vista de productos
function actualizarVistaProductos() {
    // Intentar actualizar la vista de productos si estamos en el catálogo
    if (typeof mostrarProductos === 'function') {
        // Verificar si hay filtros activos
        if (typeof productosFiltrados !== 'undefined' && productosFiltrados.length > 0) {
            if (typeof mostrarProductosFiltrados === 'function') {
                mostrarProductosFiltrados();
            }
        } else {
            mostrarProductos();
        }
    }
} 