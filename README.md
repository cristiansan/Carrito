# Carrito - Sitio Web Estático

Sitio web estático para tienda online con autenticación Firebase, catálogo de productos y sistema de pedidos.

## Estructura del Proyecto

```
Carrito/
├── public/
│   ├── index.html          # Página de login
│   ├── catalogo.html       # Catálogo y carrito
│   └── gracias.html        # Página de confirmación
├── src/
│   ├── scripts/
│   │   ├── auth.js         # Autenticación Firebase
│   │   ├── catalogo.js     # Gestión del catálogo
│   │   ├── carrito.js      # Carrito de compras
│   │   └── emailjs.js      # Envío de emails
│   └── styles/
│       └── main.css        # Estilos CSS
├── data/
│   ├── productos.json      # Catálogo de productos
│   └── clientes.json       # Configuración de márgenes
└── README.md
```

## Configuración Inicial

### 1. Firebase Authentication

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication con Email/Password
3. Crear usuarios en la consola de Firebase
4. Reemplazar la configuración en `public/index.html` y `public/catalogo.html`:

```javascript
const firebaseConfig = {
    apiKey: "tu-api-key",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "tu-app-id"
};
```

### 2. EmailJS (Opcional)

1. Crear cuenta en [EmailJS](https://www.emailjs.com/)
2. Configurar servicio de email (Gmail, Outlook, etc.)
3. Crear template de email
4. Reemplazar configuración en `src/scripts/emailjs.js`:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'tu-public-key',
    serviceId: 'tu-service-id',
    templateId: 'tu-template-id'
};
```

### 3. WhatsApp

Editar el número de WhatsApp en `src/scripts/carrito.js`:

```javascript
const numeroWhatsApp = '+1234567890'; // Tu número de WhatsApp
```

### 4. Personalizar Productos

Editar `data/productos.json` con tus productos:

```json
{
    "id": 1,
    "nombre": "Nombre del Producto",
    "imagen": "URL de la imagen",
    "descripcion": "Descripción del producto",
    "precioBase": 100.00
}
```

### 5. Configurar Márgenes de Clientes

Editar `data/clientes.json` con los emails y márgenes de tus clientes:

```json
{
    "cliente@ejemplo.com": {
        "margen": 15,
        "nombre": "Nombre del Cliente",
        "descripcion": "Cliente con margen del 15%"
    }
}
```

## Funcionalidades

### Autenticación
- Login con Firebase Auth
- Redirección automática según estado de autenticación
- Mostrar nombre del usuario logueado
- Botón de cerrar sesión

### Catálogo
- Carga productos desde JSON
- Aplicación automática de márgenes por cliente
- Interfaz responsive
- Agregar productos al carrito

### Carrito de Compras
- Persistencia en localStorage
- Actualizar cantidades
- Eliminar productos
- Calcular totales automáticamente

### Envío de Pedidos
- Envío por WhatsApp con mensaje prearmado
- Envío por email usando EmailJS
- Página de confirmación

## Despliegue

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### GitHub Pages
1. Subir archivos a repositorio GitHub
2. Habilitar GitHub Pages en configuración del repositorio
3. Seleccionar rama y carpeta

### Netlify
1. Conectar repositorio GitHub con Netlify
2. Configurar directorio de publicación como raíz
3. Deploy automático

## Personalización

### Cambiar Estilos
Editar `src/styles/main.css` para personalizar:
- Colores
- Fuentes
- Layout
- Efectos

### Agregar Funcionalidades
- Filtros de productos
- Búsqueda
- Categorías
- Promociones
- Descuentos

## Notas Importantes

1. **Seguridad**: Este es un sitio estático, la configuración de Firebase es visible. Configurar reglas de seguridad apropiadas.

2. **CORS**: Para desarrollo local, usar un servidor HTTP (no abrir archivos directamente):
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

3. **Imágenes**: Reemplazar URLs de placeholder con imágenes reales

4. **Email**: Configurar template en EmailJS para recibir pedidos

5. **Precios**: Los precios se calculan como: `precioFinal = precioBase * (1 + margen / 100)`

## Soporte

Para dudas o problemas:
1. Verificar configuración de Firebase
2. Revisar console del navegador para errores
3. Confirmar que los archivos JSON son válidos
4. Probar en servidor HTTP local

## Licencia

Este proyecto es de uso libre para fines comerciales y personales. 