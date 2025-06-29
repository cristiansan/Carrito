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

*Última actualización: Enero 2025* 