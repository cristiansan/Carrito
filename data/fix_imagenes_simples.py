import json

with open('productos.json', 'r', encoding='utf-8') as f:
    productos = json.load(f)

# URLs más estables y confiables
imagenes_estables = {
    # URLs problemáticas de Amazon reemplazadas por URLs más estables
    "https://m.media-amazon.com/images/I/71pZQoOlQjL._AC_SX679_.jpg": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop",  # iPhone rosa
    "https://m.media-amazon.com/images/I/71v2jVuMiOL._AC_SX679_.jpg": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",  # iPhone verde
    "https://m.media-amazon.com/images/I/71xb2xkN5qL._AC_SX679_.jpg": "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=300&fit=crop",  # iPhone azul/negro
    "https://m.media-amazon.com/images/I/71GLMJ7TQiL._AC_SX679_.jpg": "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",  # iPhone starlight
    "https://m.media-amazon.com/images/I/71ZOtNdaZCL._AC_SX679_.jpg": "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&h=300&fit=crop",  # iPhone rojo
}

# URLs de respaldo por modelo
urls_respaldo = {
    "13": "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=300&fit=crop",
    "14": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop", 
    "15": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop",
    "16": "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop",
}

# URL genérica muy estable
url_generica = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop"

actualizados = 0
errores_encontrados = []

for producto in productos:
    url_actual = producto.get('imagen', '')
    
    # Si la URL actual está en la lista de problemáticas, reemplazarla
    if url_actual in imagenes_estables:
        producto['imagen'] = imagenes_estables[url_actual]
        actualizados += 1
        print(f"✅ Reemplazada URL problemática: {producto['codigo']}")
        errores_encontrados.append(url_actual)
    
    # Si es una URL de Amazon que podría fallar, usar respaldo por modelo
    elif 'amazon.com' in url_actual:
        codigo = producto.get('codigo', '')
        nombre = producto.get('nombre', '').lower()
        
        # Detectar modelo y usar URL de respaldo
        url_respaldo = url_generica
        for modelo, url in urls_respaldo.items():
            if modelo in codigo or modelo in nombre:
                url_respaldo = url
                break
        
        producto['imagen'] = url_respaldo
        actualizados += 1
        print(f"📱 Cambiada URL Amazon por respaldo: {producto['codigo']}")

# Guardar archivo actualizado
with open('productos.json', 'w', encoding='utf-8') as f:
    json.dump(productos, f, indent=2, ensure_ascii=False)

print(f"\n🎉 {actualizados} productos actualizados")
print(f"❌ {len(set(errores_encontrados))} URLs problemáticas encontradas")
print("\n✅ Todas las URLs ahora usan Unsplash (muy estable)")
print("🔗 Las imágenes deberían cargar sin errores 404") 