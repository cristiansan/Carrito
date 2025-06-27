import json

with open('productos.json', 'r', encoding='utf-8') as f:
    productos = json.load(f)

# Verificar el producto específico IPH14128MDN-CH
print("=== Verificando producto específico ===")
for producto in productos:
    if 'IPH14128MDN-CH' in producto.get('codigo', ''):
        print('✅ Producto encontrado:')
        print(f'   Código: {producto["codigo"]}')
        print(f'   Nombre: {producto["nombre"]}')
        print(f'   URL: {producto["imagen"]}')
        precio = producto.get("precio", "No definido")
        if isinstance(precio, (int, float)):
            print(f'   Precio: ${precio:,.0f}')
        else:
            print(f'   Precio: {precio}')
        print(f'   Stock: {producto.get("stock", "No definido")}')
        break
else:
    print("❌ Producto no encontrado")

# Verificar que no queden URLs de Apple problemáticas
print("\n=== Verificando URLs problemáticas ===")
count_apple = 0
for producto in productos:
    if 'apple.com' in producto.get('imagen', ''):
        count_apple += 1

if count_apple == 0:
    print("✅ No hay URLs de Apple problemáticas")
else:
    print(f"⚠️  Quedan {count_apple} URLs de Apple")

# Contar productos por tipo de URL
print("\n=== Resumen de URLs ===")
amazon_count = 0
unsplash_count = 0
placeholder_count = 0

for producto in productos:
    url = producto.get('imagen', '')
    if 'amazon.com' in url:
        amazon_count += 1
    elif 'unsplash.com' in url:
        unsplash_count += 1
    elif 'placeholder' in url or not url:
        placeholder_count += 1

print(f"📦 Amazon: {amazon_count} productos")
print(f"📸 Unsplash: {unsplash_count} productos") 
print(f"🔲 Placeholder: {placeholder_count} productos")
print(f"📱 Total productos: {len(productos)}") 