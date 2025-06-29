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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    loadDesignConfig();
    
    // Aplicar estilos después de un pequeño delay para asegurar que todos los elementos estén cargados
    setTimeout(() => {
        applyComponentStyles();
    }, 500);
});

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