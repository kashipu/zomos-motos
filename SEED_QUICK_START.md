# 🚀 Quick Start - Seed Data

## En 30 segundos

```bash
# 1. Vete a la carpeta backend
cd backend

# 2. Ejecuta el seed
npm run seed

# 3. Verifica en admin
# http://localhost:1337/admin
```

## ¿Qué hace?

Carga 4 productos de ejemplo automáticamente:

### Productos de Moto (2)
- **Leva Yamaha MT-09** - $45.99
- **Filtro Honda CB500F** - $32.50

### Productos de Piloto (2)
- **Casco Bell Moto-9** - $350.00 (3 tallas/colores)
- **Chaqueta Alpinestars** - $450.00 (3 tallas/colores)

## Archivos Creados

```
backend/
├── seed_products.json           ← Datos en formato JSON
├── scripts/
│   ├── seed-database.js         ← Script automático (recomendado)
│   └── seed-simple.js           ← Script para consola Strapi
├── SEED_INSTRUCTIONS.md         ← Documentación completa
└── package.json                 ← Actualizado con "npm run seed"

SEED_SUMMARY.md                  ← Resumen del proyecto
```

## Opciones de Ejecución

### Opción 1: npm run seed ⭐ (Recomendado)
```bash
cd backend
npm run seed
```

### Opción 2: Strapi console
```bash
cd backend
strapi console
# Copia contenido de seed-simple.js o ejecuta:
# await require('./scripts/seed-database.js')(strapi);
```

### Opción 3: Node directo
```bash
cd backend
node scripts/seed-database.js
```

## Verificar Datos

1. Abre `http://localhost:1337/admin`
2. Ve a cada colección:
   - ✓ 2 marcas (Yamaha, Honda)
   - ✓ 2 modelos (MT-09, CB500F)
   - ✓ 2 categorías (Repuestos, Cascos)
   - ✓ 4 productos (2 moto + 2 piloto)

## Detalles de los Datos

### Estructura Respetada
- ✅ SKUs únicos para cada producto
- ✅ Slugs únicos para URLs
- ✅ ENUMs validados (tallas, marcas)
- ✅ Variantes con stock independiente
- ✅ Metadatos SEO para cada producto

### Variantes Piloto

**Casco Bell Moto-9:**
- M / Negro / BELL (sin módulo, 12 stock)
- L / Rojo / BELL (+$5, 8 stock)
- XL / Blanco / BELL (+$5, 5 stock)

**Chaqueta Alpinestars:**
- S / Negro / ALPINESTARS (sin módulo, 6 stock)
- M / Negro / ALPINESTARS (sin módulo, 10 stock)
- L / Rojo-Negro / ALPINESTARS (+$15, 3 stock)

## Agregar Más Datos

1. Edita `seed_products.json`
2. Sigue el formato de los ejemplos
3. Ejecuta `npm run seed`

Ejemplo:
```json
{
  "nombre": "Nuevo Producto",
  "slug": "nuevo-producto",
  "precio": 99.99,
  "referencia": "NUEVO-001",
  "descripcion": "<p>Descripción</p>",
  "categoria": "Repuestos",
  "marca_moto": "Yamaha",
  "modelo_moto": "mt-09",
  "metadatos_seo": {
    "titulo_meta": "Título para SEO",
    "descripcion_meta": "Descripción para SEO"
  }
}
```

## Documentación Completa

Para más detalles, lee [backend/SEED_INSTRUCTIONS.md](./backend/SEED_INSTRUCTIONS.md)

---

**Estado**: ✅ Listo para usar  
**Creado**: 2025-02-07
