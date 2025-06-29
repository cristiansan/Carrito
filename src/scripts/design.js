// Design System Manager
let designConfig = null;

// Cargar configuración de diseño
async function loadDesignConfig() {
    try {
        const response = await fetch('./design.json');
        if (!response.ok) {
            // Intentar desde la raíz si estamos en public/
            const rootResponse = await fetch('../design.json');
            if (!rootResponse.ok) {
                throw new Error('No se pudo cargar design.json');
            }
            designConfig = await rootResponse.json();
        } else {
            designConfig = await response.json();
        }
        
        console.log('Configuración de diseño cargada:', designConfig.theme.name);
        applyDesignToPage();
    } catch (error) {
        console.error('Error al cargar configuración de diseño:', error);
        // Usar configuración por defecto
        useDefaultDesign();
    }
}

// Aplicar diseño por defecto si no se puede cargar el JSON
function useDefaultDesign() {
    designConfig = {
        colors: {
            primary: { main: "#818cf8", dark: "#6366f1" },
            background: { primary: "#0f172a", secondary: "#1e293b", card: "#1e293b" },
            text: { primary: "#e2e8f0", secondary: "#94a3b8" },
            ui: { border: "#4b5563", input: "#374151" }
        },
        typography: {
            fontFamily: { primary: "'Inter', sans-serif" }
        }
    };
    applyDesignToPage();
}

// Aplicar diseño a la página
function applyDesignToPage() {
    if (!designConfig) return;
    
    // Aplicar variables CSS personalizadas
    const root = document.documentElement;
    
    // Colores
    if (designConfig.colors) {
        const colors = designConfig.colors;
        
        // Primarios
        if (colors.primary) {
            root.style.setProperty('--color-primary', colors.primary.main);
            root.style.setProperty('--color-primary-light', colors.primary.light);
            root.style.setProperty('--color-primary-dark', colors.primary.dark);
        }
        
        // Fondos
        if (colors.background) {
            root.style.setProperty('--bg-primary', colors.background.primary);
            root.style.setProperty('--bg-secondary', colors.background.secondary);
            root.style.setProperty('--bg-tertiary', colors.background.tertiary);
            root.style.setProperty('--bg-card', colors.background.card);
            root.style.setProperty('--bg-modal', colors.background.modal);
        }
        
        // Texto
        if (colors.text) {
            root.style.setProperty('--text-primary', colors.text.primary);
            root.style.setProperty('--text-secondary', colors.text.secondary);
            root.style.setProperty('--text-muted', colors.text.muted);
        }
        
        // UI
        if (colors.ui) {
            root.style.setProperty('--border-color', colors.ui.border);
            root.style.setProperty('--input-bg', colors.ui.input);
            root.style.setProperty('--hover-bg', colors.ui.hover);
            root.style.setProperty('--focus-color', colors.ui.focus);
        }
        
        // Acentos
        if (colors.accent) {
            root.style.setProperty('--accent-blue', colors.accent.blue);
            root.style.setProperty('--accent-green', colors.accent.green);
            root.style.setProperty('--accent-red', colors.accent.red);
            root.style.setProperty('--accent-yellow', colors.accent.yellow);
        }
    }
    
    // Tipografía
    if (designConfig.typography && designConfig.typography.fontFamily) {
        root.style.setProperty('--font-primary', designConfig.typography.fontFamily.primary);
        root.style.setProperty('--font-secondary', designConfig.typography.fontFamily.secondary);
        root.style.setProperty('--font-mono', designConfig.typography.fontFamily.mono);
    }
    
    // Espaciado
    if (designConfig.spacing) {
        Object.entries(designConfig.spacing).forEach(([key, value]) => {
            root.style.setProperty(`--spacing-${key}`, value);
        });
    }
    
    // Border radius
    if (designConfig.borderRadius) {
        Object.entries(designConfig.borderRadius).forEach(([key, value]) => {
            root.style.setProperty(`--radius-${key}`, value);
        });
    }
    
    // Aplicar clase de tema al body
    document.body.classList.add('dark-theme');
    
    console.log('Diseño aplicado exitosamente');
}

// Funciones de utilidad para obtener valores del diseño
function getColor(path) {
    if (!designConfig) return null;
    
    const keys = path.split('.');
    let value = designConfig.colors;
    
    for (const key of keys) {
        if (value && value[key]) {
            value = value[key];
        } else {
            return null;
        }
    }
    
    return value;
}

function getTypography(path) {
    if (!designConfig) return null;
    
    const keys = path.split('.');
    let value = designConfig.typography;
    
    for (const key of keys) {
        if (value && value[key]) {
            value = value[key];
        } else {
            return null;
        }
    }
    
    return value;
}

// Aplicar estilos específicos a componentes
function applyComponentStyles() {
    // Aplicar estilos a botones
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        if (designConfig && designConfig.components && designConfig.components.button) {
            const primaryBtn = designConfig.components.button.primary;
            btn.style.backgroundColor = primaryBtn.background;
            btn.style.color = primaryBtn.color;
            btn.style.borderRadius = primaryBtn.borderRadius;
            btn.style.padding = primaryBtn.padding;
            btn.style.fontSize = primaryBtn.fontSize;
            btn.style.fontWeight = primaryBtn.fontWeight;
            btn.style.transition = primaryBtn.transition;
            btn.style.border = primaryBtn.border;
        }
    });
    
    // Aplicar estilos a tarjetas de productos
    const cards = document.querySelectorAll('.producto-card');
    cards.forEach(card => {
        if (designConfig && designConfig.components && designConfig.components.card) {
            const cardStyle = designConfig.components.card;
            card.style.backgroundColor = cardStyle.background;
            card.style.border = cardStyle.border;
            card.style.borderRadius = cardStyle.borderRadius;
            card.style.padding = cardStyle.padding;
            card.style.boxShadow = cardStyle.shadow;
        }
    });
}

// Gestión de temas y diseño

// Clave para localStorage del tema
const THEME_STORAGE_KEY = 'carrito_theme';

// Tema por defecto
const DEFAULT_THEME = 'dark';

// Variable para el tema actual
let currentTheme = DEFAULT_THEME;

// Inicializar sistema de temas
function initThemeSystem() {
    // Cargar tema guardado o usar por defecto
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
    currentTheme = savedTheme;
    
    // Aplicar tema al documento
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Crear selector de tema
    createThemeSelector();
    
    // Actualizar interfaz
    updateThemeSelector();
    
    console.log(`Tema inicializado: ${currentTheme}`);
}

// Crear el selector de tema
function createThemeSelector() {
    // Verificar si ya existe
    if (document.querySelector('.theme-selector')) {
        return;
    }
    
    const themeSelector = document.createElement('div');
    themeSelector.className = 'theme-selector';
    themeSelector.innerHTML = `
        <button class="theme-toggle" title="Cambiar tema">
            <span class="theme-icon">🌙</span>
            <span class="theme-text">Oscuro</span>
        </button>
    `;
    
    // Intentar insertar en el header primero
    const header = document.querySelector('header .container');
    const headerTitle = document.querySelector('header h1');
    
    if (header && headerTitle) {
        // Crear contenedor para el lado izquierdo del header si no existe
        let headerLeft = header.querySelector('.header-left');
        if (!headerLeft) {
            headerLeft = document.createElement('div');
            headerLeft.className = 'header-left';
            headerLeft.appendChild(headerTitle);
            header.insertBefore(headerLeft, header.firstChild);
        }
        
        // Insertar el selector después del título
        headerLeft.appendChild(themeSelector);
        console.log('Selector de tema insertado en el header');
    } else {
        // Fallback: insertar como elemento flotante si no hay header
        document.body.appendChild(themeSelector);
        themeSelector.style.position = 'fixed';
        themeSelector.style.top = '20px';
        themeSelector.style.left = '20px';
        themeSelector.style.zIndex = '1000';
        console.log('Selector de tema insertado como elemento flotante');
    }
    
    // Agregar event listener al botón
    const toggleButton = themeSelector.querySelector('.theme-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleTheme);
        toggleButton.setAttribute('data-listener-added', 'true');
        console.log('Event listener del selector de tema agregado');
    }
}

// Alternar entre tema oscuro y claro
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Aplicar nuevo tema
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Guardar en localStorage
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    
    // Actualizar interfaz del selector
    updateThemeSelector();
    
    console.log(`Tema cambiado a: ${currentTheme}`);
}

// Actualizar la interfaz del selector de tema
function updateThemeSelector() {
    const themeIcon = document.querySelector('.theme-icon');
    const themeText = document.querySelector('.theme-text');
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeIcon && themeText) {
        if (currentTheme === 'dark') {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Oscuro';
        } else {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Claro';
        }
    }
    
    // Asegurar que el event listener esté presente
    if (themeToggle && !themeToggle.hasAttribute('data-listener-added')) {
        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.setAttribute('data-listener-added', 'true');
        console.log('Event listener del tema restablecido');
    }
}

// Funciones de mensaje eliminadas (según solicitud del usuario)

// Obtener tema actual
function getCurrentTheme() {
    return currentTheme;
}

// Establecer tema específico
function setTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
        updateThemeSelector();
        console.log(`Tema establecido manualmente: ${currentTheme}`);
    } else {
        console.error('Tema no válido. Use "dark" o "light".');
    }
}

// Detectar preferencia del sistema
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    } else {
        return 'light';
    }
}

// Usar tema del sistema si no hay preferencia guardada
function useSystemTheme() {
    const systemTheme = detectSystemTheme();
    setTheme(systemTheme);
}

// Escuchar cambios en la preferencia del sistema
function listenToSystemTheme() {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener((e) => {
            if (!localStorage.getItem(THEME_STORAGE_KEY)) {
                // Solo cambiar automáticamente si no hay preferencia guardada
                const newTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
            }
        });
    }
}

// Exponer funciones globalmente (solo las necesarias para uso externo)
window.getCurrentTheme = getCurrentTheme;
window.setTheme = setTheme;
window.useSystemTheme = useSystemTheme;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initThemeSystem();
    listenToSystemTheme();
});

// También inicializar inmediatamente para evitar flash
if (document.readyState === 'loading') {
    // Si el documento aún se está cargando, esperar a DOMContentLoaded
} else {
    // Si el documento ya está cargado, inicializar inmediatamente
    initThemeSystem();
    listenToSystemTheme();
}

// Observar cambios en el DOM para aplicar estilos a elementos nuevos
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Aplicar estilos a nuevos elementos después de un pequeño delay
            setTimeout(() => {
                applyComponentStyles();
            }, 100);
        }
    });
});

// Comenzar a observar cambios
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Función de debug para verificar el estado del selector de tema
function debugThemeSelector() {
    const selector = document.querySelector('.theme-selector');
    const toggle = document.querySelector('.theme-toggle');
    const icon = document.querySelector('.theme-icon');
    const text = document.querySelector('.theme-text');
    
    console.log('=== DEBUG SELECTOR DE TEMA ===');
    console.log('Selector existe:', !!selector);
    console.log('Toggle existe:', !!toggle);
    console.log('Icon existe:', !!icon);
    console.log('Text existe:', !!text);
    console.log('Tema actual:', currentTheme);
    console.log('Listener agregado:', toggle ? toggle.hasAttribute('data-listener-added') : 'N/A');
    console.log('=== FIN DEBUG ===');
    
    return {
        selector: !!selector,
        toggle: !!toggle,
        icon: !!icon,
        text: !!text,
        currentTheme: currentTheme,
        hasListener: toggle ? toggle.hasAttribute('data-listener-added') : false
    };
}

// Exponer función de debug globalmente
window.debugThemeSelector = debugThemeSelector; 