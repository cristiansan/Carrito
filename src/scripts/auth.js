// Configuración y funciones de autenticación con Firebase

// Variables globales
let currentUser = null;

// Función para detectar si estamos en la página de login
function isLoginPage() {
    const path = window.location.pathname;
    return path.includes('index.html') || path === '/' || path.endsWith('/Carrito/') || path.endsWith('/Carrito');
}

// Función para detectar si estamos en la página de catálogo
function isCatalogPage() {
    return window.location.pathname.includes('catalogo.html');
}

// Función para redirigir al catálogo
function redirectToCatalog() {
    // Detectar si estamos en GitHub Pages o en local
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
        window.location.href = 'public/catalogo.html';
    } else {
        // En local, usar ruta relativa
        window.location.href = 'public/catalogo.html';
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
    console.log('Estado de auth cambió:', user ? 'Logueado' : 'No logueado');
    console.log('Página actual:', window.location.pathname);
    
    if (user) {
        currentUser = user;
        // Si estamos en login y ya hay usuario, redirigir al catálogo
        if (isLoginPage()) {
            console.log('Usuario logueado en página de login, redirigiendo al catálogo...');
            redirectToCatalog();
        }
        // Si estamos en catálogo, mostrar info del usuario
        if (isCatalogPage()) {
            mostrarInfoUsuario(user);
        }
    } else {
        currentUser = null;
        // Si no hay usuario y no estamos en login, redirigir
        if (!isLoginPage()) {
            console.log('Usuario no logueado fuera del login, redirigiendo...');
            redirectToLogin();
        }
    }
});

// Función para mostrar información del usuario en el catálogo
function mostrarInfoUsuario(user) {
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        // Usar el displayName si está disponible, sino usar el email
        const displayName = user.displayName || user.email.split('@')[0];
        userNameElement.textContent = `Bienvenido, ${displayName}`;
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
    firebase.auth().signOut().then(() => {
        console.log('Sesión cerrada');
        redirectToLogin();
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