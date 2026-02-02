# Modelo de Datos: Accesorios de Lujo y Piloto

**Rol:** Actúa como un Arquitecto de Software Senior experto en Strapi y E-commerce.
**Objetivo:** Diseñar un esquema de base de datos estricto para una tienda de "Accesorios de Lujo y Piloto". Frontend en Astro.
**Requisito Crítico (Integridad de Datos):** Uso estricto de RELACIONES para marcas, modelos y categorías. Cero campos de texto libre para taxonomías.

## 1. Estructura de Taxonomías (Listas Cerradas)

### Collection: `Categories`
**Propósito:** Distinguir el tipo de producto.

**Campos:**
*   `name` (Text): Ej: "Cascos", "Guantes", "Escapes", "Frenos".
*   `slug` (UID).
*   `type` (Enum): `["MOTO", "PILOTO"]`.
    *   **Vital:** Esto le dice al frontend si debe mostrar filtro de tallas (Piloto) o filtro de motos (Moto).

### Collection: `Brands` (Fabricantes de Motos)
**Campos:**
*   `name` (Text)
*   `slug` (UID)
*   `logo` (Media)

**Dato Obligatorio:** Crear registro "UNIVERSAL" (Para productos de piloto o espejos genéricos).

### Collection: `BikeModels` (Modelos de Motos)
**Campos:**
*   `name` (Text)
*   `slug` (UID)
*   `brand` (Relation: Many-to-One -> `Brands`)

**Dato Obligatorio:** Crear registro "ESTÁNDAR" vinculado a la marca UNIVERSAL.

### Collection: `Years`
**Campos:**
*   `year` (Text)

**Dato Obligatorio:** Crear registro "TODOS".

---

## 2. Estructura del Producto (Transaccional)

### Collection: `Products`

**Identidad:**
*   `name` (Text)
*   `slug` (UID)
*   `price` (Number/Decimal)
*   `description` (Rich Text)
*   `images` (Media)

**Categorización:**
*   `category` (Relation: Many-to-One -> `Categories`). **Nuevo campo clave.**

**Compatibilidad (Fitment):**
*   `compatible_bikes` (Relation: Many-to-Many -> `BikeModels`).
    *   **Regla:** Si es un casco (Piloto), se selecciona ESTÁNDAR. Si es un escape, se seleccionan los modelos reales (MT-09, etc.).
*   `fitment_detail` (Componente Repetible):
    *   `model` (Relation/Text?) *[Nota: El original decía 'model + years', pero si tenemos compatible_bikes, esto podría ser para especificar años particulares]*
    *   `years` (Relation/Text?)

**Variantes (El Core para Piloto):**
*   **Crear Componente Repetible `product_variants`:**
    *   `attribute` (Enum o Text): Ej: `["Talla", "Color", "Acabado"]`.
    *   `value` (Text): Ej: "L", "42", "Rojo Mate".
    *   `price_modifier` (Number): Para sumar costo si la talla o material es especial.
    *   `stock_status` (Enum): `["Disponible", "Agotado"]`.

---

## Resumen de Lógica para el Desarrollador

### Caso Chaqueta (Piloto):
*   **Category:** "Chaquetas" (**Type:** PILOTO).
*   **Compatible Bikes:** "ESTÁNDAR" (**Brand:** UNIVERSAL).
*   **Variants:**
    *   `{ Attr: "Talla", Val: "M" }`
    *   `{ Attr: "Talla", Val: "L" }`

### Caso Escape (Moto):
*   **Category:** "Escapes" (**Type:** MOTO).
*   **Compatible Bikes:** "MT-09", "Tracer 900".
*   **Variants:**
    *   `{ Attr: "Acabado", Val: "Titanio" }`
    *   `{ Attr: "Acabado", Val: "Carbono" }`

---

## ¿Por qué este cambio es importante?

Con el campo `type` dentro de la colección **Categories**, tu frontend en Astro ahora es inteligente:

1.  Haces un fetch del producto.
2.  Si `product.category.type === 'PILOTO'`:
    *   Astro **oculta** el buscador de "¿Cuál es tu moto?"
    *   Astro **muestra** los botones de "Selecciona tu Talla".
3.  Si `product.category.type === 'MOTO'`:
    *   Astro **muestra** la advertencia de compatibilidad.
    *   Astro **oculta** las tallas (a menos que el accesorio tenga variantes de material).