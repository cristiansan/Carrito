// Configuración y funciones para EmailJS

// Configuración de EmailJS
const EMAILJS_CONFIG = {
    publicKey: 'tu-public-key', // Reemplazar con tu Public Key de EmailJS
    serviceId: 'tu-service-id', // Reemplazar con tu Service ID
    templateId: 'tu-template-id' // Reemplazar con tu Template ID
};

// Verificar si EmailJS está configurado
function isEmailJSConfigured() {
    return EMAILJS_CONFIG.publicKey !== 'tu-public-key' && 
           EMAILJS_CONFIG.serviceId !== 'tu-service-id' && 
           EMAILJS_CONFIG.templateId !== 'tu-template-id';
}

// Inicializar EmailJS
function inicializarEmailJS() {
    if (!isEmailJSConfigured()) {
        console.log('EmailJS no configurado - usando modo demo');
        return;
    }
    
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS inicializado');
    } else {
        console.error('EmailJS no está cargado');
    }
}

// Enviar pedido por email
async function enviarPedidoPorEmail() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    // Si EmailJS no está configurado, mostrar mensaje informativo
    if (!isEmailJSConfigured()) {
        const resumenPedido = generarResumenPedido();
        
        alert(`📧 EmailJS no está configurado aún.
        
Por ahora, puedes copiar este resumen y enviarlo manualmente a: cristiansan@gmail.com

${resumenPedido}`);
        
        // Copiar al portapapeles si es posible
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(resumenPedido);
                alert('✅ Resumen copiado al portapapeles');
            } catch (err) {
                console.log('No se pudo copiar al portapapeles');
            }
        }
        return;
    }

    try {
        // Mostrar loading
        const emailBtn = document.getElementById('enviar-email');
        if (emailBtn) {
            emailBtn.disabled = true;
            emailBtn.textContent = 'Enviando...';
        }

        const user = getCurrentUser();
        const resumenPedido = generarResumenPedido();
        
        // Preparar datos del email
        const templateParams = {
            to_email: 'cristiansan@gmail.com', // Email de destino actualizado
            from_name: user ? (user.displayName || user.email.split('@')[0]) : 'Usuario',
            from_email: user ? user.email : 'desconocido@email.com',
            subject: `Nuevo Pedido - ${new Date().toLocaleDateString('es-ES')}`,
            message: resumenPedido,
            order_total: calcularTotal().toFixed(2),
            order_date: new Date().toLocaleString('es-ES')
        };

        // Enviar email
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        console.log('Email enviado exitosamente:', response);
        
        // Mostrar éxito
        alert('¡Pedido enviado por email exitosamente!');
        
        // Cerrar modal
        cerrarModal();
        
        // Redirigir a página de confirmación
        setTimeout(() => {
            window.location.href = 'gracias.html';
        }, 1000);
        
        // Limpiar carrito
        carrito = [];
        guardarCarrito();
        actualizarVistaCarrito();

    } catch (error) {
        console.error('Error al enviar email:', error);
        alert('Error al enviar el pedido por email. Por favor, intenta nuevamente.');
    } finally {
        // Restaurar botón
        const emailBtn = document.getElementById('enviar-email');
        if (emailBtn) {
            emailBtn.disabled = false;
            emailBtn.textContent = 'Enviar por Email';
        }
    }
}

// Función para crear un template básico de email (para referencia)
function crearTemplateEmail() {
    return `
    Plantilla de Email para EmailJS:
    
    Asunto: Nuevo Pedido - {{subject}}
    
    Cuerpo del email:
    
    Estimado/a Administrador/a,
    
    Se ha recibido un nuevo pedido:
    
    Cliente: {{from_name}}
    Email: {{from_email}}
    Fecha: {{order_date}}
    Total: ${{order_total}}
    
    Detalles del pedido:
    {{message}}
    
    Saludos,
    Sistema de Pedidos Carrito
    `;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('catalogo.html')) {
        // Inicializar EmailJS cuando se cargue la página
        inicializarEmailJS();
        
        // Event listener para enviar por email
        const enviarEmailBtn = document.getElementById('enviar-email');
        if (enviarEmailBtn) {
            enviarEmailBtn.addEventListener('click', enviarPedidoPorEmail);
        }
    }
});

// Función para verificar configuración de EmailJS
function verificarConfiguracion() {
    const configuracionFaltante = [];
    
    if (EMAILJS_CONFIG.publicKey === 'tu-public-key') {
        configuracionFaltante.push('Public Key');
    }
    if (EMAILJS_CONFIG.serviceId === 'tu-service-id') {
        configuracionFaltante.push('Service ID');
    }
    if (EMAILJS_CONFIG.templateId === 'tu-template-id') {
        configuracionFaltante.push('Template ID');
    }
    
    if (configuracionFaltante.length > 0) {
        console.warn('Configuración de EmailJS faltante:', configuracionFaltante);
        return false;
    }
    
    return true;
}

// Función para mostrar instrucciones de configuración
function mostrarInstruccionesEmailJS() {
    console.log(`
    INSTRUCCIONES PARA CONFIGURAR EMAILJS:
    
    1. Crear cuenta en https://www.emailjs.com/
    2. Crear un servicio de email (Gmail, Outlook, etc.)
    3. Crear un template de email
    4. Obtener las credenciales y reemplazar en EMAILJS_CONFIG:
       - publicKey: Tu Public Key
       - serviceId: Tu Service ID  
       - templateId: Tu Template ID
    
    5. Template sugerido:
    ${crearTemplateEmail()}
    `);
} 