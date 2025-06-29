# Carrito - Sistema de Tienda Online

Sistema de tienda online con autenticación Firebase, gestión de inventario y sistema de pedidos.

## Características Principales

- **Autenticación con Firebase Auth**: Login seguro con email/contraseña
- **Catálogo de productos**: Visualización de productos con filtros y búsqueda
- **Gestión de stock temporal**: El stock se reduce automáticamente al agregar productos al carrito
- **Carrito de compras**: Gestión completa del carrito con localStorage
- **Sistema de pedidos**: Envío por EmailJS y WhatsApp
- **Diseño responsivo**: Optimizado para móviles y escritorio
- **Márgenes por cliente**: Precios diferenciados según el usuario
- **Selector de tema**: Cambio entre tema oscuro y claro con persistencia

## Nueva Funcionalidad: Selector de Tema Oscuro/Claro

### ¿Cómo funciona?

1. **Selector integrado**: Botón en el header junto al título "Carrito"
2. **Cambio instantáneo**: Transición suave entre temas
3. **Persistencia**: La preferencia se guarda en localStorage
4. **Detección automática**: Respeta la preferencia del sistema operativo
5. **Responsivo**: Se adapta a dispositivos móviles

### Temas disponibles

- 🌙 **Tema Oscuro**: Colores oscuros para reducir fatiga visual
- ☀️ **Tema Claro**: Colores claros para mejor visibilidad diurna

### Funciones de administración

```javascript
// Cambiar tema manualmente
toggleTheme()

// Obtener tema actual
getCurrentTheme()

// Establecer tema específico
setTheme('dark') // o 'light'

// Usar tema del sistema operativo
useSystemTheme()
```

## Nueva Funcionalidad: Indicador de Versión y Changelog

### ¿Cómo funciona?

1. **Indicador de versión**: Muestra la versión actual (v0.1.0) junto al selector de tema
2. **Modal de changelog**: Al hacer clic se abre un modal con el historial completo de cambios
3. **Organización por versiones**: Cada versión tiene fecha y lista de mejoras
4. **Iconos descriptivos**: Cada cambio tiene un emoji que representa el tipo de mejora
5. **Navegación intuitiva**: Se puede cerrar con ESC, clic fuera del modal o botón de cerrar

### Características del changelog

- 📋 **Historial completo**: Todas las funcionalidades y mejoras implementadas
- 🔢 **Versiones incrementales**: Cada mejora tiene su propia versión numerada
- 🎨 **Diseño limpio**: Modal minimalista con foco en el contenido
- 📱 **Responsivo**: Se adapta perfectamente a dispositivos móviles
- ⌨️ **Accesibilidad**: Soporte para navegación con teclado

### Versiones disponibles

- **v0.1.12**: Modal de historial de cambios y versiones
- **v0.1.11**: Selector de tema oscuro/claro integrado en header
- **v0.1.10**: Indicadores visuales de stock (verde/amarillo/rojo)
- **v0.1.9**: Validaciones de stock y productos disponibles
- **v0.1.8**: Gestión de stock temporal en tiempo real
- **v0.1.7**: Sistema de filtros avanzado por modelo y capacidad
- **v0.1.6**: Sistema de envío de pedidos por Email y WhatsApp
- **v0.1.5**: Carrito de compras funcional con persistencia
- **v0.1.4**: Diseño completamente responsivo para múltiples dispositivos
- **v0.1.3**: Conversión de Excel a JSON para mejorar velocidad de carga
- **v0.1.2**: Listado de productos leído desde archivo Excel
- **v0.1.1**: Sistema de autenticación con Firebase
- **v0.1.0**: Lanzamiento inicial del sitio web de Carrito

## Nueva Funcionalidad: Gestión de Stock Temporal

### ¿Cómo funciona?

1. **Stock disponible**: Cada producto muestra su stock disponible en tiempo real
2. **Reducción automática**: Al agregar un producto al carrito, el stock disponible se reduce automáticamente
3. **Validación**: No se pueden agregar más productos de los disponibles
4. **Persistencia**: El stock temporal se mantiene durante la sesión del usuario
5. **Restauración**: Al eliminar productos del carrito, el stock se restaura automáticamente

### Indicadores visuales

- 🟢 **Stock OK**: Productos con stock suficiente (>5 unidades)
- 🟡 **Stock Bajo**: Productos con stock limitado (≤5 unidades)
- 🔴 **Agotado**: Productos sin stock disponible

### Funciones de administración

```javascript
// Ver información del stock temporal
obtenerInfoStockTemporal()

// Limpiar completamente el stock temporal
limpiarStockTemporal()

// Verificar stock disponible de un producto
obtenerStockDisponible(productoId)
```

## Configuración

### 1. Firebase Setup
```javascript
// Configurar en src/scripts/auth.js
const firebaseConfig = {
    apiKey: "tu-api-key",
    authDomain: "tu-dominio.firebaseapp.com",
    // ... resto de configuración
};
```

### 2. Estructura de archivos
```
Carrito/
├── index.html                 # Página de login
├── public/
│   ├── index.html            # Página principal
│   ├── catalogo.html         # Catálogo de productos
│   └── gracias.html          # Página de confirmación
├── src/
│   ├── scripts/
│   │   ├── auth.js           # Autenticación Firebase
│   │   ├── catalogo.js       # Gestión del catálogo y stock
│   │   ├── carrito.js        # Gestión del carrito
│   │   └── emailjs.js        # Envío de emails
│   └── styles/
│       └── main.css          # Estilos principales
└── data/
    ├── productos.json        # Base de datos de productos
    └── clientes.json         # Configuración de márgenes
```

### 3. Formato de productos
```json
{
  "id": 1,
  "nombre": "iPhone 13 128GB Azul",
  "imagen": "https://ejemplo.com/imagen.jpg",
  "descripcion": "Descripción del producto",
  "precioBase": 1000.0,
  "codigo": "IPH13128BLUE",
  "stock": 50,
  "transit": 10,
  "categoria": "iPhone 13"
}
```

### 4. Configuración de clientes
```json
{
  "usuario@ejemplo.com": { "margen": 15 },
  "admin@ejemplo.com": { "margen": 0 },
  "default": { "margen": 10 }
}
```

## Uso

### Para usuarios finales

1. **Iniciar sesión**: Usar email y contraseña registrados
2. **Explorar catálogo**: Navegar por los productos disponibles
3. **Agregar al carrito**: Seleccionar cantidad y agregar productos
4. **Gestionar carrito**: Modificar cantidades o eliminar productos
5. **Realizar pedido**: Enviar por WhatsApp o email

### Para administradores

1. **Gestionar productos**: Editar `data/productos.json`
2. **Configurar márgenes**: Editar `data/clientes.json`
3. **Monitorear stock**: Usar funciones de debugging en consola
4. **Resetear stock**: Usar `limpiarStockTemporal()` si es necesario

## Tecnologías utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Autenticación**: Firebase Auth
- **Almacenamiento**: localStorage
- **Comunicación**: EmailJS, WhatsApp API
- **Diseño**: CSS Grid, Flexbox, Responsive Design

## Despliegue

### GitHub Pages
El sitio está configurado para funcionar en GitHub Pages:
- URL: `https://tuusuario.github.io/Carrito/`
- Archivos necesarios en la raíz del repositorio

### Local
```bash
# Clonar repositorio
git clone https://github.com/tuusuario/Carrito.git

# Abrir con servidor local
python -m http.server 8000
# o
npx http-server
```

## Troubleshooting

### Problemas comunes

1. **Stock no se actualiza**: Verificar que las funciones estén expuestas globalmente
2. **Productos no cargan**: Verificar rutas de `productos.json`
3. **Login no funciona**: Verificar configuración de Firebase
4. **Stock temporal persistente**: Usar `limpiarStockTemporal()` para resetear

### Logs útiles

```javascript
// Ver stock temporal actual
console.log(obtenerInfoStockTemporal());

// Ver productos en carrito
console.log(JSON.parse(localStorage.getItem('tienda_carrito')));

// Ver stock temporal en localStorage
console.log(JSON.parse(localStorage.getItem('tienda_stock_temporal')));
```

## Próximas mejoras

- [ ] Integración con base de datos real
- [ ] Sistema de reservas por tiempo limitado
- [ ] Notificaciones push para stock bajo
- [ ] Panel de administración web
- [ ] Sistema de descuentos y promociones

## Contacto

Para soporte o consultas, contactar a través de:
- WhatsApp: +54 11 6625-1922
- Email: configurar en EmailJS

---

*Última actualización: 17 de Junio 2025* 