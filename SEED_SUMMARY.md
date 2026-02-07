# 🌱 Resumen: Seed de Datos para Zomos Motos

## ¿Qué Se Creó?

Se creó un sistema completo de **seed data** (datos iniciales) para poblar la base de datos de Zomos Motos con la nueva arquitectura de dos catálogos independientes.

## Archivos Creados

### 1. **`backend/seed_products.json`** 📄
Archivo JSON con toda la estructura de datos iniciales. Contiene:

- **2 Marcas de Motos**: Yamaha, Honda
- **2 Modelos de Moto**: MT-09 (Yamaha), CB500F (Honda)
- **2 Categorías**: Repuestos (tipo MOTO), Cascos (tipo PILOTO)
- **2 Productos Moto**:
  - Leva de Lujo Yamaha MT-09 ($45.99)
  - Filtro de Aire Premium Honda CB500F ($32.50)
- **2 Productos Piloto**:
  - Casco Integral Bell Moto-9 ($350.00) con 3 variantes
  - Chaqueta de Moto Alpinestars GP Pro ($450.00) con 3 variantes

### 2. **`backend/scripts/seed-database.js`** 🚀
Script Node.js profesional que:
- Lee el archivo `seed_products.json`
- Crea registros en orden correcto (marcas → modelos → categorías → productos)
- Verifica si existen antes de crear (evita duplicados)
- Maneja relaciones entre colecciones automáticamente
- Proporciona feedback visual (✓, →, ✅, ❌)

**Uso:**
```bash
cd backend
npm run seed
```

### 3. **`backend/scripts/seed-simple.js`** 💻
Script alternativo que puedes ejecutar directamente en la consola de Strapi:
```bash
strapi console
# Luego copia y pega el contenido o ejecuta:
# await require('./scripts/seed-simple.js')(strapi);
```

### 4. **`backend/SEED_INSTRUCTIONS.md`** 📚
Documentación completa con:
- Descripción detallada de cada colección
- Instrucciones paso a paso para ejecutar el seed
- Validaciones y restricciones
- Enumeraciones permitidas (ENUMs)
- Solución de problemas comunes
- Cómo agregar más datos

### 5. **`backend/package.json`** (Actualizado)
Se agregó el script:
```json
"seed": "strapi console < scripts/seed-database.js"
```

## Datos Incluidos

### Productos de Moto

| Nombre | SKU | Precio | Marca | Modelo |
|--------|-----|--------|-------|--------|
| Leva de Lujo | LEVA-YAM-MT09-001 | $45.99 | Yamaha | MT-09 |
| Filtro de Aire | FILTRO-HON-CB500-001 | $32.50 | Honda | CB500F |

### Productos de Piloto

| Nombre | SKU | Precio Base | Variantes | Stock Total |
|--------|-----|-------------|-----------|-------------|
| Casco Bell Moto-9 | CASCO-BELL-MOTO9-001 | $350.00 | 3 (M/Negro, L/Rojo, XL/Blanco) | 25 |
| Chaqueta Alpinestars | CHAQ-ALPI-GPPRO-001 | $450.00 | 3 (S/Negro, M/Negro, L/Rojo-Negro) | 19 |

## Validaciones y Restricciones

El seed respeta todas las validaciones de la arquitectura:

✅ **Campos Únicos**:
- Slugs únicos para marcas, modelos, categorías y productos
- SKUs únicos para cada producto

✅ **ENUMs Estrictos**:
- `categoria.tipo`: Solo `MOTO` o `PILOTO`
- `variante_piloto.talla`: `XS`, `S`, `M`, `L`, `XL`, `XXL`, `UNICA`
- `variante_piloto.marca_piloto`: 17 marcas permitidas (`ALPINESTARS`, `BELL`, etc.)

✅ **Relaciones Correctas**:
- Productos moto relacionados a marca y modelo específicos
- Productos piloto con arreglo de variantes
- Metadatos SEO para todas las entidades

## Próximos Pasos

### 1. Ejecutar el Seed
```bash
cd backend
npm run seed
```

### 2. Verificar en Admin
Abre `http://localhost:1337/admin` y verifica que:
- Existen 2 marcas (Yamaha, Honda)
- Existen 2 modelos (MT-09, CB500F)
- Existen 2 categorías (Repuestos, Cascos)
- Existen 4 productos (2 moto + 2 piloto)
- Los pilotos tienen variantes con stock correcto

### 3. Conectar Frontend
El frontend puede ahora:
- Consultar productos por tipo (moto/piloto)
- Filtrar por marca, modelo, categoría
- Mostrar variantes en selectores
- Validar stock por variante

## Ventajas de Este Sistema

| Ventaja | Beneficio |
|---------|-----------|
| **Automatizado** | Ejecuta con un comando |
| **Idempotente** | Seguro ejecutar múltiples veces |
| **Escalable** | Fácil agregar más productos |
| **Documentado** | Instrucciones claras incluidas |
| **Validado** | Respeta toda la arquitectura |
| **Recuperable** | JSON simple para backup/migración |

## Ejemplo: Agregar Más Datos

Para agregar un nuevo producto moto a `seed_products.json`:

```json
{
  "nombre": "Cadena de Transmisión XL",
  "slug": "cadena-transmision-xl",
  "precio": 89.99,
  "referencia": "CADENA-XL-001",
  "descripcion": "<p>Cadena premium para máximo rendimiento</p>",
  "categoria": "Repuestos",
  "marca_moto": "Yamaha",
  "modelo_moto": "mt-09",
  "metadatos_seo": {
    "titulo_meta": "Cadena XL para Yamaha MT-09 | Zomos Motos",
    "descripcion_meta": "Cadena de transmisión premium con máxima durabilidad."
  }
}
```

Luego ejecuta `npm run seed` nuevamente.

## Troubleshooting

### "Unique constraint failed"
→ Un registro ya existe. Elimina duplicados o cambia el slug/referencia.

### "Invalid enum value"
→ Los valores de talla o marca_piloto no coinciden con los ENUMs definidos.

### Script no ejecuta
→ Asegúrate de estar en `/backend` y que Strapi esté iniciado.

## Documentación Relacionada

- [SEED_INSTRUCTIONS.md](./backend/SEED_INSTRUCTIONS.md) - Guía completa
- [@docs/schemassp.md](./docs/schemassp.md) - Esquema de BD
- [@docs/frontend.md](./docs/frontend.md) - Integración frontend

---

**Creado**: 2025-02-07
**Estado**: ✅ Listo para usar
**Próximo paso**: Ejecutar `npm run seed`
