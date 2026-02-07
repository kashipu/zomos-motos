# 🌱 Instrucciones de Seed - Zomos Motos Backend

## Descripción

El archivo `seed_products.json` contiene datos iniciales para poblar la base de datos de Zomos Motos con la nueva arquitectura de dos catálogos independientes:

- **Catálogo Moto**: Accesorios y repuestos para motocicletas específicas (marca + modelo)
- **Catálogo Piloto**: Equipo de protección con variantes (talla + color + marca)

## Contenido del Seed

### Datos de Referencia
- **2 Marcas de Motos**: Yamaha, Honda
- **2 Modelos de Moto**: MT-09 (Yamaha), CB500F (Honda)
- **2 Categorías**: Repuestos (MOTO), Cascos (PILOTO)

### Productos de Moto (2)
1. **Leva de Lujo Yamaha MT-09**
   - Referencia: `LEVA-YAM-MT09-001`
   - Precio: $45.99
   - Compatibilidad: Yamaha MT-09

2. **Filtro de Aire Premium Honda CB500F**
   - Referencia: `FILTRO-HON-CB500-001`
   - Precio: $32.50
   - Compatibilidad: Honda CB500F

### Productos de Piloto (2)
1. **Casco Integral Bell Moto-9**
   - Referencia: `CASCO-BELL-MOTO9-001`
   - Precio: $350.00
   - Variantes: 3 (M/Negro, L/Rojo, XL/Blanco)

2. **Chaqueta de Moto Alpinestars GP Pro**
   - Referencia: `CHAQ-ALPI-GPPRO-001`
   - Precio: $450.00
   - Variantes: 3 (S/Negro, M/Negro, L/Rojo-Negro)

## Requisitos Previos

1. **Base de datos creada**: Asegúrate de que Strapi está configurado correctamente
2. **Colecciones definidas**: Las siguientes colecciones deben existir en tu Strapi:
   - `marca`
   - `modelo-moto`
   - `categoria`
   - `producto-moto`
   - `producto-piloto`

3. **ENUMs configurados** en los esquemas de Strapi:
   - `categoria.tipo`: `MOTO`, `PILOTO`
   - `variante_piloto.talla`: `XS`, `S`, `M`, `L`, `XL`, `XXL`, `UNICA`
   - `variante_piloto.marca_piloto`: `ALPINESTARS`, `BELL`, `FOX`, etc.

## Cómo Usar

### Opción 1: Usando Strapi Console (Recomendado)

```bash
cd backend

# Con npm
npm run seed

# Con bun
bun run seed
```

### Opción 2: Importar Manualmente en Strapi Admin

1. Abre la URL de admin de Strapi (ej: `http://localhost:1337/admin`)
2. Inicia sesión con tu cuenta
3. Ve a cada colección y crea manualmente los registros siguiendo el formato en `seed_products.json`

### Opción 3: Usar Scripts Personalizados

Si `npm run seed` no funciona, puedes ejecutar directamente:

```bash
# Con Node.js
node scripts/seed-database.js

# O dentro de Strapi console
await require('./scripts/seed-database.js')(strapi);
```

## Estructura del Archivo seed_products.json

```json
{
  "seed": {
    "marcas": [
      {
        "nombre": "string (requerido, único)",
        "slug": "string (requerido, único)"
      }
    ],
    "modelos_moto": [
      {
        "nombre": "string",
        "slug": "string",
        "marca": "string (referencia a marca.nombre)"
      }
    ],
    "categorias": [
      {
        "nombre": "string (único)",
        "slug": "string (único)",
        "tipo": "MOTO | PILOTO",
        "descripcion": "string"
      }
    ],
    "productos_moto": [
      {
        "nombre": "string",
        "slug": "string (único)",
        "precio": "decimal",
        "referencia": "string (SKU, único)",
        "descripcion": "string (HTML)",
        "categoria": "string (referencia a categoria.nombre)",
        "marca_moto": "string (referencia a marca.nombre)",
        "modelo_moto": "string (referencia a modelo.slug)",
        "metadatos_seo": {
          "titulo_meta": "string (max 60 chars)",
          "descripcion_meta": "string (max 160 chars)"
        }
      }
    ],
    "productos_piloto": [
      {
        "nombre": "string",
        "slug": "string (único)",
        "precio": "decimal",
        "referencia": "string (SKU, único)",
        "descripcion": "string (HTML)",
        "categoria": "string (referencia a categoria.nombre)",
        "marca_generico": "boolean",
        "variantes_piloto": [
          {
            "talla": "XS | S | M | L | XL | XXL | UNICA",
            "color": "string",
            "marca_piloto": "ALPINESTARS | BELL | FOX | ... | GENERICA",
            "modificador_precio": "decimal (opcional)",
            "cantidad_stock": "integer >= 0"
          }
        ],
        "metadatos_seo": {
          "titulo_meta": "string (max 60 chars)",
          "descripcion_meta": "string (max 160 chars)"
        }
      }
    ]
  }
}
```

## Validaciones y Restricciones

### Campos Únicos (No Duplicados)
- `marca.nombre`
- `marca.slug`
- `modelo_moto.slug`
- `categoria.nombre`
- `categoria.slug`
- `producto_moto.slug`
- `producto_moto.referencia` (SKU)
- `producto_piloto.slug`
- `producto_piloto.referencia` (SKU)

### ENUMs (Valores Permitidos Exactamente)

**categoria.tipo:**
```
MOTO
PILOTO
```

**variante_piloto.talla:**
```
XS
S
M
L
XL
XXL
UNICA
```

**variante_piloto.marca_piloto:**
```
ALPINESTARS
BELL
FOX
SHOEI
ARAI
LAZER
SIMPSON
PELTOR
SCOTT
LEATT
DAINESE
ONEAL
HJC
AGVPRO
NOLAN
SHARK
GENERICA
```

## Solución de Problemas

### Error: "UNIQUE constraint failed: marca.nombre"
→ Ya existen marcas con el mismo nombre. Elimina registros previos o cambia los nombres en `seed_products.json`.

### Error: "Invalid enum value"
→ Verifica que los valores de `tipo`, `talla` y `marca_piloto` coincidan exactamente con los ENUMs definidos (case-sensitive).

### Error: "Not found: marca"
→ La marca referenciada no existe. Ejecuta el seed completo respetando el orden: marcas → modelos → categorías → productos.

### Script no ejecuta
→ Asegúrate de estar en la carpeta `backend` y que Strapi esté corriendo. Algunos comandos requieren que Strapi esté iniciado primero.

## Agregar Más Datos

Para agregar más productos al seed:

1. Edita `seed_products.json`
2. Sigue la estructura exacta de los ejemplos existentes
3. Asegúrate de que:
   - Los `slug` sean únicos
   - Las `referencia` (SKU) sean únicas
   - Las marcas y categorías referenciadas existan
   - Los ENUMs sean válidos

Ejemplo para agregar un nuevo producto moto:

```json
{
  "nombre": "Cadena de Transmisión XL",
  "slug": "cadena-transmision-xl",
  "precio": 89.99,
  "referencia": "CADENA-XL-001",
  "descripcion": "<p>Cadena de transmisión reforzada para máximo rendimiento.</p>",
  "categoria": "Repuestos",
  "marca_moto": "Yamaha",
  "modelo_moto": "mt-09",
  "metadatos_seo": {
    "titulo_meta": "Cadena XL para Yamaha MT-09 | Zomos Motos",
    "descripcion_meta": "Cadena de transmisión premium con máxima durabilidad y rendimiento."
  }
}
```

## Base de Datos

### PostgreSQL (Producción)

Si usas PostgreSQL en producción, el script se adaptará automáticamente. Asegúrate de que:

1. Existe el archivo `.env` con credenciales correctas:
   ```
   DATABASE_CLIENT=postgres
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=zomos_motos
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=tu_contraseña
   ```

2. La base de datos existe:
   ```bash
   createdb zomos_motos
   ```

### SQLite (Desarrollo)

Por defecto usa SQLite. Los datos se guardan en `database/data.db`.

## Próximos Pasos

1. ✅ Ejecuta el seed para cargar datos iniciales
2. 📝 Accede a `http://localhost:1337/admin` para verificar los datos
3. 🚀 Comienza el desarrollo del frontend con datos reales

---

**Última actualización**: 2025-02-07
