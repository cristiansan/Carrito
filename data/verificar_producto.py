import json

with open('productos.json', 'r', encoding='utf-8') as f:
    productos = json.load(f)

# Buscar el producto específico
for producto in productos:
    if 'IPH14128MDN-CH' in producto.get('codigo', ''):
        print(f'Producto: {producto["nombre"]}')
        print(f'Código: {producto["codigo"]}')
        print(f'URL actual: {producto["imagen"]}')
        break
else:
    print("Producto no encontrado")

# Verificar productos con URLs problemáticas
print("\n=== Productos con URLs de Apple ===")
count = 0
for producto in productos:
    if 'apple.com' in producto.get('imagen', ''):
        count += 1
        print(f"{count}. {producto['codigo']}")
        
print(f"\nTotal productos con URLs de Apple: {count}")

# Verificar productos iPhone en general
print("\n=== Todos los productos iPhone ===")
iphone_count = 0
for producto in productos:
    nombre = producto.get('nombre', '').lower()
    codigo = producto.get('codigo', '').lower()
    if 'iphone' in nombre or 'iph' in codigo:
        iphone_count += 1
        
print(f"Total productos iPhone: {iphone_count}") 