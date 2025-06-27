// Configuración y funciones de autenticación con Firebase

// Variables globales
let currentUser = null;

// Función para detectar si estamos en la página de login
function isLoginPage() {
    const path = window.location.pathname;
    return path.includes('index.html') || path === '/' || path.endsWith('/Carrito/') || path.endsWith('/Carrito') || path.endsWith('/public/') || path.endsWith('/public');
}

// Función para detectar si estamos en la página de catálogo
function isCatalogPage() {
    return window.location.pathname.includes('catalogo.html');
}

// Función para redirigir al catálogo
function redirectToCatalog() {
    const currentPath = window.location.pathname;
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
        window.location.href = 'public/catalogo.html';
    } else {
        // Si ya estamos en /public/, usar ruta relativa
        if (currentPath.includes('/public/')) {
            window.location.href = 'catalogo.html';
        } else {
            // Si estamos en la raíz, ir a public/catalogo.html
            window.location.href = 'public/catalogo.html';
        }
    }
}

// Función para redirigir al login
function redirectToLogin() {
    // Detectar si estamos en GitHub Pages o en local
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
        window.location.href = '/Carrito/';
    } else {
        // En local, ir a la raíz
        window.location.href = '/';
    }
}

// Verificar estado de autenticación al cargar la página
firebase.auth().onAuthStateChanged((user) => {
    
    if (user) {
        currentUser = user;
        
        // Si estamos en login y ya hay usuario, redirigir al catálogo
        if (isLoginPage()) {
            setTimeout(() => {
                redirectToCatalog();
            }, 1000);
        }
        // Si estamos en catálogo, mostrar botones de usuario logueado
        if (isCatalogPage()) {
            mostrarBotonesLogueado();
        }
    } else {
        currentUser = null;
        // Si estamos en catálogo sin usuario, mostrar botones para invitados
        if (isCatalogPage()) {
            mostrarBotonesInvitado();
        }
        // Solo redirigir al login si estamos en páginas que requieren autenticación
        // El catálogo ahora se puede ver sin login
    }
});

// Función para mostrar botones cuando el usuario está logueado
function mostrarBotonesLogueado() {
    const userNameElement = document.getElementById('user-name');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Actualizar interfaz de usuario
    if (userNameElement && loginBtn && logoutBtn) {
        const user = getCurrentUser();
        const displayName = user ? (user.displayName || user.email.split('@')[0]) : 'Usuario';
        userNameElement.textContent = `Bienvenido, ${displayName}`;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        
        // Agregar event listener al botón de cerrar sesión
        logoutBtn.removeEventListener('click', cerrarSesion); // Remover listener anterior si existe
        logoutBtn.addEventListener('click', cerrarSesion);
        console.log('Event listener agregado al botón logout');
    }
    
    // Restaurar sección del carrito original
    const carritoSection = document.querySelector('.carrito-section');
    if (carritoSection) {
        carritoSection.innerHTML = `
            <h2>Carrito de Compras</h2>
            <div id="carrito-vacio" class="carrito-vacio" style="display: none;">
                <p>Tu carrito está vacío</p>
            </div>
            
            <div id="carrito-contenido" class="carrito-contenido">
                <table id="carrito-tabla">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="carrito-items">
                        <!-- Los items del carrito se cargarán aquí -->
                    </tbody>
                </table>
                
                <div class="carrito-total">
                    <h3>Total: $<span id="total-carrito">0.00</span></h3>
                </div>
                
                <div class="carrito-acciones">
                    <button id="limpiar-carrito" class="btn-secondary">Vaciar Carrito</button>
                    <button id="enviar-pedido" class="btn-primary">Enviar Pedido</button>
                </div>
            </div>
        `;
        carritoSection.style.display = 'block';
        
        // Reinicializar event listeners del carrito
        setTimeout(() => {
            const limpiarBtn = document.getElementById('limpiar-carrito');
            const enviarBtn = document.getElementById('enviar-pedido');
            
            if (limpiarBtn) {
                limpiarBtn.addEventListener('click', limpiarCarrito);
            }
            if (enviarBtn) {
                enviarBtn.addEventListener('click', mostrarModalEnvio);
            }
        }, 100);
    }
    
    // Asegurar que el catálogo se actualice después de configurar la interfaz
    setTimeout(() => {
        if (typeof mostrarProductos === 'function') {
            mostrarProductos();
        }
    }, 100);
}

// Función para mostrar botones cuando el usuario es invitado
function mostrarBotonesInvitado() {
    const userNameElement = document.getElementById('user-name');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Actualizar interfaz de usuario para invitado
    if (userNameElement && loginBtn && logoutBtn) {
        userNameElement.textContent = 'Visitando como invitado';
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }
    
    // Restaurar sección del carrito pero con botones deshabilitados para pedidos
    const carritoSection = document.querySelector('.carrito-section');
    if (carritoSection) {
        carritoSection.innerHTML = `
            <h2>Carrito de Compras</h2>
            <div id="carrito-vacio" class="carrito-vacio" style="display: none;">
                <p>Tu carrito está vacío</p>
            </div>
            
            <div id="carrito-contenido" class="carrito-contenido">
                <table id="carrito-tabla">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="carrito-items">
                        <!-- Los items del carrito se cargarán aquí -->
                    </tbody>
                </table>
                
                <div class="carrito-total">
                    <h3>Total: $<span id="total-carrito">0.00</span></h3>
                </div>
                
                <div class="carrito-acciones">
                    <button id="limpiar-carrito" class="btn-secondary">Vaciar Carrito</button>
                    <button id="enviar-pedido" class="btn-primary" style="background: #ffc107; color: #000;" onclick="alert('Inicia sesión para realizar pedidos'); irALogin();">Iniciar Sesión para Comprar</button>
                </div>
                
                <div style="text-align: center; margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 4px; border: 1px solid #ffeaa7;">
                    <small style="color: #856404;">💡 Puedes agregar productos al carrito, pero necesitas iniciar sesión para realizar pedidos</small>
                </div>
            </div>
        `;
        carritoSection.style.display = 'block';
        
        // Reinicializar event listeners del carrito para invitados
        setTimeout(() => {
            const limpiarBtn = document.getElementById('limpiar-carrito');
            
            if (limpiarBtn) {
                limpiarBtn.addEventListener('click', limpiarCarrito);
            }
        }, 100);
    }
    
    // Asegurar que el catálogo se actualice después de configurar la interfaz
    setTimeout(() => {
        if (typeof mostrarProductos === 'function') {
            mostrarProductos();
        }
    }, 100);
}

// Función para ir al login
function irALogin() {
    const currentPath = window.location.pathname;
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
        window.location.href = '/Carrito/';
    } else {
        if (currentPath.includes('/public/')) {
            window.location.href = 'index.html';
        } else {
            window.location.href = '/';
        }
    }
}

// Función de login
function iniciarSesion(email, password) {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    const loginBtn = document.getElementById('loginBtn');
    
    // Mostrar loading
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';
    loginBtn.disabled = true;
    
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login exitoso
            console.log('Usuario logueado:', userCredential.user);
            // La redirección se maneja en onAuthStateChanged
        })
        .catch((error) => {
            // Manejar errores
            console.error('Error en login:', error);
            mostrarError(getErrorMessage(error.code));
        })
        .finally(() => {
            // Ocultar loading
            loadingElement.style.display = 'none';
            loginBtn.disabled = false;
        });
}

// Función para cerrar sesión
function cerrarSesion() {
    console.log('Función cerrarSesion llamada');
    firebase.auth().signOut().then(() => {
        console.log('Sesión cerrada');
        // Si estamos en el catálogo, mostrar estado de invitado
        if (isCatalogPage()) {
            mostrarBotonesInvitado();
        } else {
            // Si estamos en otra página, ir al login
            redirectToLogin();
        }
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
    });
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = mensaje;
        errorElement.style.display = 'block';
    }
}

// Función para obtener mensajes de error en español
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'No se encontró una cuenta con este email.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-email': 'El formato del email no es válido.',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
        'auth/invalid-credential': 'Las credenciales no son válidas.'
    };
    
    return errorMessages[errorCode] || 'Error desconocido. Intenta nuevamente.';
}

// Event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en la página del catálogo, inicializar estado por defecto
    if (isCatalogPage()) {
        // Inicializar como invitado por defecto
        mostrarBotonesInvitado();
    }
    
    // Event listener para el formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                iniciarSesion(email, password);
            } else {
                mostrarError('Por favor, completa todos los campos.');
            }
        });
    }
    
    // Event listener para el botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarSesion();
        });
    }
});

// Función para obtener el usuario actual
function getCurrentUser() {
    return currentUser;
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return currentUser !== null;
} 