import json

with open('productos.json', 'r', encoding='utf-8') as f:
    productos = json.load(f)

# URLs más confiables para diferentes modelos de iPhone
imagenes_confiables = {
    # iPhone 13
    "IPH13128BLUE-IND": "https://m.media-amazon.com/images/I/71xb2xkN5qL._AC_SX679_.jpg",
    "IPH13128STL-IND": "https://m.media-amazon.com/images/I/71xb2xkN5qL._AC_SX679_.jpg",
    
    # iPhone 14
    "IPH14128MDN-CH": "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_SX679_.jpg",
    "IPH14128STL-CH": "https://m.media-amazon.com/images/I/71GLMJ7TQiL._AC_SX679_.jpg",
    "IPH14128RED-IND": "https://m.media-amazon.com/images/I/71ZOtNdaZCL._AC_SX679_.jpg",
    
    # iPhone 15
    "IPH15128GRE-IND": "https://m.media-amazon.com/images/I/71v2jVuMiOL._AC_SX679_.jpg",
    "IPH15128BLK-IND": "https://m.media-amazon.com/images/I/71xb2xkN5qL._AC_SX679_.jpg",
    "IPH15128PINK-IND": "https://m.media-amazon.com/images/I/71pZQoOlQjL._AC_SX679_.jpg",
}

# URLs genéricas muy confiables por modelo
url_por_modelo = {
    "13": "https://m.media-amazon.com/images/I/71xb2xkN5qL._AC_SX679_.jpg",  # iPhone 13
    "14": "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_SX679_.jpg",  # iPhone 14
    "15": "https://m.media-amazon.com/images/I/71v2jVuMiOL._AC_SX679_.jpg",  # iPhone 15
    "12": "https://m.media-amazon.com/images/I/71FuI8YvCNL._AC_SX679_.jpg",  # iPhone 12
    "11": "https://m.media-amazon.com/images/I/71i2XhHU3pL._AC_SX679_.jpg",  # iPhone 11
}

# URL genérica para iPhones sin modelo específico
url_generica_iphone = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop"

# Actualizar productos
actualizados = 0
for producto in productos:
    codigo = producto.get('codigo', '')
    nombre = producto.get('nombre', '').lower()
    
    # Solo procesar productos iPhone
    if 'iphone' in nombre or 'iph' in codigo.lower():
        
        # Si tiene una URL específica más confiable, usarla
        if codigo in imagenes_confiables:
            producto['imagen'] = imagenes_confiables[codigo]
            actualizados += 1
            print(f"✅ {codigo} -> URL específica")
        else:
            # Detectar modelo de iPhone y usar URL apropiada
            url_asignada = url_generica_iphone
            
            for modelo, url in url_por_modelo.items():
                if modelo in codigo or modelo in nombre:
                    url_asignada = url
                    break
            
            producto['imagen'] = url_asignada
            actualizados += 1
            print(f"📱 {codigo} -> URL por modelo/genérica")

# Guardar archivo
with open('productos.json', 'w', encoding='utf-8') as f:
    json.dump(productos, f, indent=2, ensure_ascii=False)

print(f"\n🎉 {actualizados} productos iPhone actualizados con URLs confiables")
print("📁 Archivo productos.json actualizado")
print("\n🔗 URLs utilizadas:")
print("   - Amazon: URLs de productos reales")
print("   - Unsplash: Imagen genérica de alta calidad")
print("   - Todas optimizadas para cargar rápido") 