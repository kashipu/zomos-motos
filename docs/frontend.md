# Arquitectura Frontend - Zomos Motos Storefront (Astro 5)

## 🚀 Actualizaciones Implementadas (2025-02-07)

### Mejoras en Gestión del Carrito

**Archivo:** `src/store/cart.ts`
- ✅ Nuevas interfaces: `CartItemMoto` y `CartItemPiloto` con campos específicos
- ✅ Nueva función `updateQuantity(id, quantity)` para cambiar cantidades
- ✅ Nueva función `getCartTotal()` que calcula correctamente con modificador de precio
- ✅ Nueva función `getCartItemCount()` para contar items totales
- ✅ Soporte para `variante_id` en pilotos (para identificar combinaciones talla×color×marca)
- ✅ Cálculo automático de precio con `modificador_precio` para pilotos

**Archivo:** `src/components/CartDrawer.tsx`
- ✅ Controles de cantidad (+/−) funcionales en cada item
- ✅ Mostrar detalles de variante para pilotos: talla, color, marca_piloto
- ✅ Mostrar referencia (SKU) del producto
- ✅ Para motos: mostrar marca_moto y modelo_moto
- ✅ Alerta visual si hay poco stock (≤ 3 unidades)
- ✅ Cálculo correcto de precio: `precio_base + modificador_precio`
- ✅ Mostrar precio tachado si hay modificador
- ✅ UI mejorada con controles más grandes y accesibles

---

## Stack Tecnológico
- **Framework:** [Astro](https://astro.build/) (v5.0+)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes UI:** React 18 + Lucide Icons
- **Estado Local:** Nanostores (con persistencia local)

## Integración con Strapi (Nueva Arquitectura)

### Dos Catálogos Independientes

La nueva estructura de Strapi define **dos colecciones de productos separadas**:

1. **`producto-moto`**: Accesorios y repuestos para motos específicas
   - Siempre tiene: `marca_moto`, `modelo_moto`
   - NO tiene variantes (talla, color, etc.)
   - Ejemplo: "Leva de Lujo para Yamaha MT-09"

2. **`producto-piloto`**: Equipo de protección y accesorios para pilotos
   - Tiene: `variantes_piloto` (talla, color, marca_piloto)
   - Tiene: `marca_generico` (boolean)
   - Ejemplo: "Casco Bell con variantes M, L, XL"

### Funciones de Utilidad Strapi

Ubicadas en `src/lib/strapi.ts`:

#### `queryStrapi(query: string, variables?: object)`
Función genérica para obtener datos del CMS con GraphQL.

```typescript
// Obtener productos para motos
const motos = await queryStrapi(`
  query {
    productoMotos(filters: { marca_moto: { slug: { eq: "yamaha" } } }) {
      data {
        id
        nombre
        precio
        referencia
        imagenes { url }
        marca_moto { nombre slug }
        modelo_moto { nombre slug }
        metadatos_seo { titulo_meta descripcion_meta }
      }
    }
  }
`);

// Obtener productos para pilotos con variantes
const pilotos = await queryStrapi(`
  query {
    productoPilotos(filters: { categoria: { slug: { eq: "cascos" } } }) {
      data {
        id
        nombre
        precio
        referencia
        imagenes { url }
        variantes_piloto {
          talla
          color
          marca_piloto
          cantidad_stock
          modificador_precio
        }
        marca_generico
        metadatos_seo { titulo_meta descripcion_meta }
      }
    }
  }
`);
```

#### `getStrapiMedia(url: string)`
Resuelve automáticamente las URLs de imágenes, manejando el prefijo del host de Strapi (útil para desarrollo local).

#### `getStrapiFilters(type: 'moto' | 'piloto')`
Obtiene filtros disponibles según el tipo de producto.

```typescript
// Para productos de moto
const motoFilters = {
  marcas: [], // De marca
  modelos: [], // De modelo-moto
  categorias: [], // De categoria (tipo=MOTO)
  precios: { min, max }
};

// Para productos de piloto
const pilotoFilters = {
  marcas_piloto: [], // ENUM de marca_piloto
  tallas: [], // ENUM de talla
  colores: [], // Únicos de variantes
  categorias: [], // De categoria (tipo=PILOTO)
  precios: { min, max }
};
```

---

## Filtros y Búsqueda

### Filtros para Productos Moto

```typescript
// Por marca de moto
filters: { marca_moto: { slug: { eq: "yamaha" } } }

// Por modelo de moto
filters: { modelo_moto: { slug: { eq: "mt-09" } } }

// Por categoría
filters: { categoria: { slug: { eq: "repuestos" } } }

// Por precio
filters: { precio: { gte: 10, lte: 100 } }

// Combinados (AND)
filters: {
  marca_moto: { slug: { eq: "yamaha" } },
  modelo_moto: { slug: { eq: "mt-09" } },
  precio: { gte: 10, lte: 100 }
}
```

### Filtros para Productos Piloto

```typescript
// Por marca de equipo
filters: { variantes_piloto: { marca_piloto: { eq: "BELL" } } }

// Por talla disponible
filters: { variantes_piloto: { talla: { eq: "M" } } }

// Por categoría
filters: { categoria: { slug: { eq: "cascos" } } }

// Solo genéricos o de marca
filters: { marca_generico: { eq: true } } // o false

// Por precio
filters: { precio: { gte: 100, lte: 500 } }

// Combinar: cascos BELL en talla M con stock > 0
filters: {
  categoria: { slug: { eq: "cascos" } },
  variantes_piloto: {
    marca_piloto: { eq: "BELL" },
    talla: { eq: "M" },
    cantidad_stock: { gt: 0 }
  }
}
```

### Búsqueda de Texto

```typescript
// Búsqueda en nombre o descripción
filters: {
  $or: [
    { nombre: { containsi: "casco" } },
    { descripcion: { containsi: "protección" } }
  ]
}
```

---

## Componentes Críticos (React Islands)

### 1. `AddToCart.tsx`
Botón hidratado en el cliente que añade ítems al carrito.

**Para Productos Moto:**
```typescript
interface MotoCartItem {
  id: string;
  nombre: string;
  referencia: string; // SKU único
  precio: number;
  imagen: string;
  marca_moto: string;
  modelo_moto: string;
}
```

**Para Productos Piloto:**
```typescript
interface PilotoCartItem {
  id: string;
  nombre: string;
  referencia: string; // SKU único
  precio: number;
  imagen: string;
  // Variante seleccionada
  talla: string;
  color: string;
  marca_piloto: string;
  cantidad_stock: number;
  modificador_precio: number; // Sumar a precio base
}
```

- **Dato:** Incluye `referencia` (SKU), `precio`, `imagen`, y datos de variante si aplica.
- **Estado:** Interactúa con el store de Nanostores.
- **Validación:** Verificar que `cantidad_stock > 0` antes de permitir agregar.

### 2. `CartDrawer.tsx`
Isla reactiva que maneja el resumen de compra y totales.
- **Checkout:** Llama al backend (puerto 1338) para registrar el `INTENT`.
- **Cálculo de Precio:** Para pilotos, considerar `precio + modificador_precio` por variante.
- **Imágenes:** Procesa las URLs de Strapi usando `getStrapiMedia()`.
- **Resumen:** Mostrar detalles de variantes (talla, color, marca) en el carrito.

---

## Gestión de Estado (Nanostores)

El store se define en `src/store/cart.ts` usando `@nanostores/persistent`. Esto garantiza que los clientes no pierdan su carrito al navegar por la web o recargar la página.

### Interfaces de Carrito

```typescript
// Interfaz base para todos los items
export interface CartItem {
  id: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  image?: string;
  tipo?: 'moto' | 'piloto';
}

// Items de moto
export interface CartItemMoto extends CartItem {
  tipo: 'moto';
  marca_moto: string;
  modelo_moto: string;
}

// Items de piloto (con variantes)
export interface CartItemPiloto extends CartItem {
  tipo: 'piloto';
  talla: string;
  color: string;
  marca_piloto: string;
  cantidad_stock: number;
  modificador_precio: number;
  variante_id?: string; // Combinación única: talla+color+marca
}
```

### Funciones de Store

```typescript
// Añadir item al carrito (agrupa variantes iguales)
addToCart(item: CartItemType): void

// Actualizar cantidad (elimina si cantidad ≤ 0)
updateQuantity(id: string, quantity: number): void

// Eliminar item del carrito
removeFromCart(id: string): void

// Calcular total incluyendo modificadores
getCartTotal(): number

// Contar items totales
getCartItemCount(): number

// Limpiar carrito
clearCart(): void
```

### Ejemplo de Uso

```typescript
// Producto de moto
const motoItem: CartItemMoto = {
  id: "123",
  tipo: 'moto',
  name: "Leva de Lujo",
  sku: "LEVA-LUX-001",
  price: 45.99,
  quantity: 2,
  image: "...",
  marca_moto: "Yamaha",
  modelo_moto: "MT-09"
};

addToCart(motoItem);
updateQuantity("123", 3);

// Producto de piloto
const pilotoItem: CartItemPiloto = {
  id: "456",
  tipo: 'piloto',
  variante_id: "456-M-Negro-BELL", // Clave única
  name: "Casco Bell Moto-9",
  sku: "CASCO-BELL-001",
  price: 350.00,
  quantity: 1,
  image: "...",
  talla: "M",
  color: "Negro",
  marca_piloto: "BELL",
  cantidad_stock: 10,
  modificador_precio: 0
};

addToCart(pilotoItem);
updateQuantity("456-M-Negro-BELL", 2);
```

---

## Queries Strapi Completas

### Obtener Todas las Categorías por Tipo

```typescript
// Categorías para motos
const categories = await queryStrapi(`
  query {
    categorias(filters: { tipo: { eq: MOTO } }) {
      data {
        id
        nombre
        slug
        descripcion
      }
    }
  }
`);

// Categorías para pilotos
const pilotCategories = await queryStrapi(`
  query {
    categorias(filters: { tipo: { eq: PILOTO } }) {
      data {
        id
        nombre
        slug
        descripcion
      }
    }
  }
`);
```

### Obtener Marcas y Modelos

```typescript
// Todas las marcas de motos
const brands = await queryStrapi(`
  query {
    marcas {
      data {
        id
        nombre
        slug
        logo { url }
      }
    }
  }
`);

// Modelos por marca
const models = await queryStrapi(`
  query {
    modeloMotos(filters: { marca: { slug: { eq: "yamaha" } } }) {
      data {
        id
        nombre
        slug
      }
    }
  }
`);
```

### Obtener Variantes Disponibles

```typescript
// Tallas, colores y marcas disponibles
const variants = await queryStrapi(`
  query {
    productoPilotos(filters: { categoria: { slug: { eq: "cascos" } } }) {
      data {
        variantes_piloto {
          talla
          color
          marca_piloto
          cantidad_stock
        }
      }
    }
  }
`);

// Extraer valores únicos en el cliente
const tallas = [...new Set(variants.map(v => v.talla))];
const colores = [...new Set(variants.map(v => v.color))];
const marcas = [...new Set(variants.map(v => v.marca_piloto))];
```

---

## Recomendaciones de Estructura

### Para Páginas de Listado

**`src/pages/motos/[marca].astro`**
- Filtrar por `marca_moto.slug`
- Opciones: Filtro por `modelo_moto`, rango de precio
- Componentes: Grid de productos, sidebar de filtros

**`src/pages/pilotos/[categoria].astro`**
- Filtrar por `categoria.slug` y `tipo=PILOTO`
- Opciones: Filtro por `talla`, `marca_piloto`, `color`, precio
- Componentes: Grid con selector de variantes, sidebar dinámico

### Para Página de Detalle

**`src/pages/producto/[slug].astro`**
- Detectar tipo por colección
- Mostrar variantes para pilotos (selector interactivo)
- Mostrar compatibilidad para motos (marca + modelo)

### Para Carrito

**Consideraciones:**
- Items de moto y piloto se pueden mezclar en un carrito
- Pilotos necesitan validar stock por variante específica
- Mostrar claramente: referencia, variante seleccionada, precio final

---

## 🔍 SEO y Estructura de Rutas

### Principios SEO Generales

1. **URLs Semánticas**: Usar slugs descriptivos y en español
2. **Estructura Jerárquica**: Productos agrupados en categorías → marcas/modelos
3. **Meta Tags**: Usar `metadatos_seo` de Strapi en cada página
4. **Schema Markup**: Implementar JSON-LD para productos
5. **Sitemap Dinámico**: Generar automáticamente desde Strapi
6. **Canonical URLs**: Evitar contenido duplicado

---

## 🗂️ Estructura de Rutas Recomendada

### Rutas para Productos de Moto

```
/motos                                  → Página principal de motos
/motos/[marca-slug]                     → Listado por marca (ej: /motos/yamaha)
/motos/[marca-slug]/[modelo-slug]       → Listado por modelo (ej: /motos/yamaha/mt-09)
/motos/[marca-slug]/[modelo-slug]/[slug] → Detalle producto
/motos/categoria/[categoria-slug]       → Listado por categoría (ej: /motos/categoria/repuestos)
```

**Ejemplo de URLs:**
- `/motos` → Todas las motos
- `/motos/yamaha` → Productos Yamaha
- `/motos/yamaha/mt-09` → Productos compatibles MT-09
- `/motos/yamaha/mt-09/leva-de-lujo` → Detalle del producto
- `/motos/categoria/repuestos` → Todos los repuestos

### Rutas para Productos de Piloto

```
/piloto                                 → Página principal de equipo piloto
/piloto/[categoria-slug]                → Listado por categoría (ej: /piloto/cascos)
/piloto/[categoria-slug]/[slug]         → Detalle producto
/piloto/marca/[marca-piloto]            → Filtro por marca equipo (ej: /piloto/marca/bell)
/piloto/talla/[talla]                   → Filtro por talla (ej: /piloto/talla/m)
```

**Ejemplo de URLs:**
- `/piloto` → Equipo de piloto
- `/piloto/cascos` → Todos los cascos
- `/piloto/cascos/casco-bell-moto-9` → Detalle del casco
- `/piloto/marca/bell` → Cascos Bell disponibles
- `/piloto/talla/m` → Equipo en talla M

### Rutas Especiales

```
/buscar                                 → Página de búsqueda
/buscar?q=casco                         → Resultados de búsqueda
/comparar                               → Página de comparación (opcional)
/mis-favoritos                          → Productos guardados (requiere login)
```

---

## 📝 Implementación de Rutas en Astro

### Rutas Dinámicas para Motos

**`src/pages/motos/index.astro`** - Página principal
```typescript
---
import { queryStrapi } from '../lib/strapi';

export async function getStaticPaths() {
  return [{ params: { }, props: {} }];
}

const { data } = await queryStrapi(`
  query {
    marcas {
      data { id nombre slug logo { url } }
    }
  }
`);
---
```

**`src/pages/motos/[marca].astro`** - Listado por marca
```typescript
---
import { queryStrapi } from '../../lib/strapi';

export async function getStaticPaths() {
  const { data: marcas } = await queryStrapi(`
    query {
      marcas { data { slug } }
    }
  `);

  return marcas.map(marca => ({
    params: { marca: marca.slug },
    props: { marca }
  }));
}

const { marca } = Astro.params;
const { data: productos } = await queryStrapi(`
  query {
    productoMotos(filters: { marca_moto: { slug: { eq: "${marca}" } } }) {
      data {
        id nombre slug precio referencia
        imagenes { url }
        marca_moto { nombre slug }
        modelo_moto { nombre slug }
        metadatos_seo { titulo_meta descripcion_meta imagen_meta { url } }
      }
    }
  }
`);
---
```

**`src/pages/motos/[marca]/[modelo].astro`** - Listado por modelo
```typescript
---
export async function getStaticPaths() {
  const { data: modelos } = await queryStrapi(`
    query {
      modeloMotos {
        data {
          slug
          marca { slug }
        }
      }
    }
  `);

  return modelos.map(modelo => ({
    params: { marca: modelo.marca.slug, modelo: modelo.slug },
    props: { modelo }
  }));
}

const { marca, modelo } = Astro.params;
const { data: productos } = await queryStrapi(`
  query {
    productoMotos(filters: {
      marca_moto: { slug: { eq: "${marca}" } }
      modelo_moto: { slug: { eq: "${modelo}" } }
    }) {
      data { ... }
    }
  }
`);
---
```

**`src/pages/motos/[marca]/[modelo]/[slug].astro`** - Detalle del producto
```typescript
---
export async function getStaticPaths() {
  const { data: productos } = await queryStrapi(`
    query {
      productoMotos {
        data {
          slug
          marca_moto { slug }
          modelo_moto { slug }
        }
      }
    }
  `);

  return productos.map(prod => ({
    params: {
      marca: prod.marca_moto.slug,
      modelo: prod.modelo_moto.slug,
      slug: prod.slug
    },
    props: { producto: prod }
  }));
}

const { slug, marca, modelo } = Astro.params;
const { data: [producto] } = await queryStrapi(`
  query {
    productoMotos(filters: { slug: { eq: "${slug}" } }) {
      data {
        id nombre precio referencia descripcion
        imagenes { url }
        marca_moto { nombre slug }
        modelo_moto { nombre slug }
        categoria { nombre slug }
        metadatos_seo {
          titulo_meta
          descripcion_meta
          imagen_meta { url }
          url_canonica_personalizada
        }
      }
    }
  }
`);
---

<!-- Head con meta tags SEO -->
<head>
  <title>{producto.metadatos_seo?.titulo_meta || producto.nombre}</title>
  <meta name="description" content={producto.metadatos_seo?.descripcion_meta} />
  <meta name="og:title" content={producto.nombre} />
  <meta name="og:image" content={producto.metadatos_seo?.imagen_meta?.url} />
  {producto.metadatos_seo?.url_canonica_personalizada && (
    <link rel="canonical" href={producto.metadatos_seo.url_canonica_personalizada} />
  )}
  <!-- JSON-LD Schema -->
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": producto.nombre,
    "image": producto.imagenes[0]?.url,
    "description": producto.metadatos_seo?.descripcion_meta,
    "sku": producto.referencia,
    "offers": {
      "@type": "Offer",
      "price": producto.precio,
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock"
    },
    "brand": {
      "@type": "Brand",
      "name": producto.marca_moto.nombre
    }
  })} />
</script>
</head>
```

### Rutas Dinámicas para Pilotos

**`src/pages/piloto/index.astro`** - Página principal
```typescript
---
const { data: categorias } = await queryStrapi(`
  query {
    categorias(filters: { tipo: { eq: PILOTO } }) {
      data { id nombre slug }
    }
  }
`);
---
```

**`src/pages/piloto/[categoria].astro`** - Listado por categoría
```typescript
---
export async function getStaticPaths() {
  const { data: categorias } = await queryStrapi(`
    query {
      categorias(filters: { tipo: { eq: PILOTO } }) {
        data { slug }
      }
    }
  `);

  return categorias.map(cat => ({
    params: { categoria: cat.slug },
    props: { categoria: cat }
  }));
}

const { categoria } = Astro.params;
const { data: productos } = await queryStrapi(`
  query {
    productoPilotos(filters: { categoria: { slug: { eq: "${categoria}" } } }) {
      data {
        id nombre slug precio referencia
        imagenes { url }
        variantes_piloto { talla color marca_piloto cantidad_stock }
        metadatos_seo { titulo_meta descripcion_meta }
      }
    }
  }
`);
---
```

**`src/pages/piloto/[categoria]/[slug].astro`** - Detalle del producto
```typescript
---
export async function getStaticPaths() {
  const { data: productos } = await queryStrapi(`
    query {
      productoPilotos {
        data {
          slug
          categoria { slug }
        }
      }
    }
  `);

  return productos.map(prod => ({
    params: {
      categoria: prod.categoria.slug,
      slug: prod.slug
    },
    props: { producto: prod }
  }));
}

const { slug, categoria } = Astro.params;
const { data: [producto] } = await queryStrapi(`
  query {
    productoPilotos(filters: { slug: { eq: "${slug}" } }) {
      data {
        id nombre precio referencia descripcion
        imagenes { url }
        categoria { nombre slug }
        variantes_piloto {
          talla color marca_piloto cantidad_stock modificador_precio
        }
        marca_generico
        metadatos_seo {
          titulo_meta
          descripcion_meta
          imagen_meta { url }
          url_canonica_personalizada
        }
      }
    }
  }
`);
---

<!-- Meta tags y Schema para productos con variantes -->
<head>
  <title>{producto.metadatos_seo?.titulo_meta || producto.nombre}</title>
  <meta name="description" content={producto.metadatos_seo?.descripcion_meta} />
  <meta name="og:image" content={producto.metadatos_seo?.imagen_meta?.url} />

  <!-- JSON-LD para producto con variantes -->
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": producto.nombre,
    "image": producto.imagenes[0]?.url,
    "sku": producto.referencia,
    "offers": producto.variantes_piloto.map(v => ({
      "@type": "Offer",
      "price": producto.precio + (v.modificador_precio || 0),
      "priceCurrency": "COP",
      "availability": v.cantidad_stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "size": v.talla,
      "color": v.color
    }))
  })} />
</script>
</head>
```

---

## 🚀 Optimizaciones SEO Recomendadas

### 1. Sitemap Dinámico

**`src/pages/sitemap.xml.ts`**
```typescript
export async function GET() {
  const { data: motos } = await queryStrapi(`
    query {
      productoMotos { data { slug marca_moto { slug } modelo_moto { slug } } }
    }
  `);

  const { data: pilotos } = await queryStrapi(`
    query {
      productoPilotos { data { slug categoria { slug } } }
    }
  `);

  const urls = [
    { url: 'https://zomos-motos.com', priority: 1.0 },
    { url: 'https://zomos-motos.com/motos', priority: 0.9 },
    { url: 'https://zomos-motos.com/piloto', priority: 0.9 },
    ...motos.map(p => ({
      url: `https://zomos-motos.com/motos/${p.marca_moto.slug}/${p.modelo_moto.slug}/${p.slug}`,
      priority: 0.8
    })),
    ...pilotos.map(p => ({
      url: `https://zomos-motos.com/piloto/${p.categoria.slug}/${p.slug}`,
      priority: 0.8
    }))
  ];

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map(u => `<url><loc>${u.url}</loc><priority>${u.priority}</priority></url>`).join('')}
    </urlset>
  `, { headers: { 'Content-Type': 'application/xml' } });
}
```

### 2. Robots.txt

**`public/robots.txt`**
```
User-agent: *
Allow: /

Sitemap: https://zomos-motos.com/sitemap.xml
Disallow: /admin
Disallow: /carrito
Disallow: /checkout
```

### 3. Canonical URLs

Usar `url_canonica_personalizada` de Strapi cuando exista, sino generar automáticamente:

```typescript
const canonicalUrl = producto.metadatos_seo?.url_canonica_personalizada
  || `https://zomos-motos.com${Astro.url.pathname}`;
```

### 4. Open Graph y Twitter Cards

```astro
<meta property="og:title" content={producto.nombre} />
<meta property="og:description" content={producto.metadatos_seo?.descripcion_meta} />
<meta property="og:image" content={producto.metadatos_seo?.imagen_meta?.url} />
<meta property="og:url" content={canonicalUrl} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={producto.nombre} />
<meta name="twitter:description" content={producto.metadatos_seo?.descripcion_meta} />
<meta name="twitter:image" content={producto.metadatos_seo?.imagen_meta?.url} />
```

### 5. Búsqueda Estructurada (Breadcrumbs)

```typescript
// Para motos: Inicio > Motos > Yamaha > MT-09 > Leva de Lujo
const breadcrumbs = [
  { name: 'Inicio', url: '/' },
  { name: 'Motos', url: '/motos' },
  { name: producto.marca_moto.nombre, url: `/motos/${producto.marca_moto.slug}` },
  { name: producto.modelo_moto.nombre, url: `/motos/${producto.marca_moto.slug}/${producto.modelo_moto.slug}` },
  { name: producto.nombre, url: Astro.url.pathname }
];

<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": item.name,
    "item": item.url
  }))
})} />
```

### 6. Imágenes Optimizadas

- Usar atributos `alt` descriptivos desde Strapi
- Lazy loading nativo: `loading="lazy"`
- Responsive images: `srcset` con múltiples tamaños
- Formatos modernos: WebP con fallback

```astro
<picture>
  <source srcset={getStrapiMedia(imagen.url) + '?format=webp'} type="image/webp" />
  <img
    src={getStrapiMedia(imagen.url)}
    alt={producto.nombre}
    loading="lazy"
    width="400"
    height="400"
  />
</picture>
```

---

## 📊 Estrategia de Contenido

| Tipo Página | Meta Title | Meta Description | Prioridad |
|-----------|-----------|-----------------|-----------|
| Inicio | "Accesorios y Equipo para Motos - Zomos Motos" | Descripción general (max 160 caracteres) | 1.0 |
| Marca | "{Marca} - Accesorios Moto \| Zomos" | Productos {Marca}, modelos compatibles | 0.9 |
| Modelo | "Repuestos {Marca} {Modelo} \| Zomos" | Accesorios compatibles {Marca} {Modelo} | 0.85 |
| Producto Moto | "{Nombre} para {Marca} {Modelo}" | Breve descripción + compatibilidad | 0.8 |
| Categoría Piloto | "{Categoría} de Piloto - Zomos Motos" | Equipo de protección {Categoría} | 0.9 |
| Producto Piloto | "{Nombre} - Equipo Piloto" | Descripción + tallas y marcas disponibles | 0.8 |

---

## ⚙️ Checklist SEO

- [ ] Todas las páginas tienen `titulo_meta` único (máx 60 caracteres)
- [ ] Todas las páginas tienen `descripcion_meta` único (máx 160 caracteres)
- [ ] URLs son semánticas y descriptivas (en español)
- [ ] Estructura jerárquica clara (marca > modelo > producto)
- [ ] Schema Markup (JSON-LD) en todas las páginas de producto
- [ ] Breadcrumbs implementados
- [ ] Sitemap XML dinámico generado
- [ ] Robots.txt configurado
- [ ] Canonical URLs para evitar duplicados
- [ ] Imágenes con alt text descriptivo
- [ ] Open Graph y Twitter Cards
- [ ] Performance: LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] Mobile-first responsive design
- [ ] Internal links hacia productos relacionados

---

## 📦 Mapeo de Componentes y Tareas

### Estado Actual de la Implementación

El frontend ya tiene una estructura base funcional, pero requiere ajustes para alinearse con la **nueva arquitectura de dos catálogos separados** (`producto-moto` vs `producto-piloto`).

---

### 🔧 Componentes por Migrar/Actualizar

#### 1. **Librerías y Utilidades** (`src/lib/strapi.ts`)

**Estado:** ✅ Implementado (parcialmente)

**Lo que está:**
- `queryStrapi()`: Función genérica de fetch (usa REST, no GraphQL)
- `getStrapiMedia()`: Resuelve URLs de imágenes

**Tareas pendientes:**
- [ ] Actualizar a usar **GraphQL** en lugar de REST
- [ ] Crear función `queryMotoProducts()` específica para productos motos
- [ ] Crear función `queryPilotoProducts()` específica para productos pilotos
- [ ] Implementar `getStrapiFilters()` para obtener filtros dinámicos
- [ ] Agregar caché de consultas para mejor performance
- [ ] Validar respuestas contra tipos esperados

**Ejemplo de cambio necesario:**
```typescript
// De REST
queryStrapi<any[]>("products", { params: { ... } })

// A GraphQL
queryStrapiGraphQL(`
  query {
    productoMotos(filters: { ... }) {
      data { ... }
    }
  }
`)
```

---

#### 2. **Gestión de Estado Carrito** (`src/store/cart.ts`)

**Estado:** ✅ Implementado (completo)

**Lo que está:**
- ✅ Interfaces separadas: `CartItemMoto` vs `CartItemPiloto`
- ✅ Campo `tipo` para distinguir productos
- ✅ Para pilotos: `talla`, `color`, `marca_piloto`, `cantidad_stock`, `modificador_precio`
- ✅ Función `updateQuantity()` para modificar cantidad
- ✅ Cálculo de precio con `modificador_precio`
- ✅ Soporte para `variante_id` (combinación única de variante)
- ✅ Funciones helper: `getCartTotal()`, `getCartItemCount()`

**Tareas pendientes:**
- [ ] Validar `cantidad_stock` antes de agregar en AddToCart.tsx
- [ ] Mostrar advertencia si se intenta aumentar más allá del stock disponible
- [ ] Implementar lógica de checkout que valide stock actual

```typescript
export interface MotoCartItem {
  id: string;
  nombre: string;
  referencia: string;
  precio: number;
  imagen: string;
  tipo: 'moto';
}

export interface PilotoCartItem {
  id: string;
  nombre: string;
  referencia: string;
  precio: number;
  imagen: string;
  tipo: 'piloto';
  talla: string;
  color: string;
  marca_piloto: string;
  cantidad_stock: number;
  modificador_precio: number;
}
```

---

#### 3. **Botón Agregar al Carrito** (`src/components/AddToCart.tsx`)

**Estado:** ✅ Implementado (básico)

**Lo que está:**
- UI con selector de cantidad
- Conexión a store de Nanostores
- Estilos Tailwind

**Tareas pendientes:**
- [ ] Aceptar interfaz genérica `CartItem`
- [ ] Para pilotos: mostrar selector de talla, color, marca
- [ ] Validar stock disponible antes de permitir agregar
- [ ] Mostrar confirmación de agregado al carrito
- [ ] Para pilotos: calcular precio con modificador
- [ ] Deshabilitar botón si stock = 0
- [ ] Mensaje de producto agregado exitosamente

---

#### 4. **Carrito (Drawer)** (`src/components/CartDrawer.tsx`)

**Estado:** ✅ Implementado (completo)

**Lo que está:**
- ✅ UI del drawer deslizable
- ✅ Listado de items con imagen y precio
- ✅ Botón de checkout por WhatsApp
- ✅ Controles de cantidad (+/−) funcionales
- ✅ Mostrar datos de variante para pilotos (talla, color, marca)
- ✅ Mostrar detalles de moto (marca_moto, modelo_moto)
- ✅ Mostrar referencia (SKU) de producto
- ✅ Cálculo correcto: `precio + modificador_precio`
- ✅ Indicador visual de poco stock (≤ 3 unidades)
- ✅ Mostrar precio tachado si hay modificador

**Tareas pendientes:**
- [ ] Tooltip o mensaje al pasar sobre stock bajo
- [ ] Confirmación antes de eliminar item
- [ ] Botón "Vaciar carrito" con confirmación
- [ ] Resumen separado por tipo (moto/piloto) opcional

---

#### 5. **Página de Catálogo** (`src/pages/productos/index.astro`)

**Estado:** ⚠️ Implementado (pero con lógica antigua)

**Lo que está:**
- Grid de productos
- Breadcrumbs
- Filtros por categoría
- Búsqueda por marca/modelo (lógica antigua)

**Tareas pendientes:**
- [ ] Separar en dos rutas: `/motos` y `/piloto`
- [ ] Para motos: Filtros por `marca_moto`, `modelo_moto`, categoría
- [ ] Para pilotos: Filtros por `talla`, `marca_piloto`, `color`, categoría
- [ ] Usar queries GraphQL nuevas
- [ ] Implementar ordenamiento (precio, novedades)
- [ ] Paginación funcional
- [ ] Cargar metadatos SEO por página
- [ ] Lazy loading de imágenes
- [ ] Integración con nuevas colecciones de Strapi

---

#### 6. **Página de Detalle de Producto** (`src/pages/productos/[slug].astro`)

**Estado:** ⚠️ Implementado (necesita refactorización)

**Tareas pendientes:**
- [ ] Detectar automáticamente si es `producto-moto` o `producto-piloto`
- [ ] Para motos: mostrar marca_moto + modelo_moto
- [ ] Para pilotos: mostrar selector interactivo de variantes
- [ ] Para pilotos: mostrar matriz de disponibilidad (talla × color × marca)
- [ ] Usar queries GraphQL nuevas
- [ ] Implementar Schema Markup (JSON-LD)
- [ ] Breadcrumbs jerárquicos: Marca > Modelo > Producto
- [ ] Mostrar productos relacionados de la misma categoría
- [ ] Galería de imágenes optimizada
- [ ] Lazy loading de imágenes
- [ ] Meta tags SEO desde `metadatos_seo`

---

#### 7. **Página de Inicio** (`src/pages/index.astro`)

**Estado:** ✅ Existe (sin tareas en plan)

**Tareas pendientes:**
- [ ] Agregar CTA para `/motos` y `/piloto`
- [ ] Mostrar categorías destacadas
- [ ] Slider de productos nuevos
- [ ] Sección de "Productos en oferta"
- [ ] SEO meta tags

---

### 🔍 Nuevos Componentes a Crear

#### 1. **Selector de Variantes** (`src/components/SelectorVariantes.tsx`)

Para productos piloto con múltiples variantes.

**Responsabilidades:**
- Mostrar matriz interactiva: Talla × Color × Marca Piloto
- Indicar disponibilidad por combinación
- Actualizar precio con `modificador_precio`
- Validar stock antes de permitir selección
- Emitir evento con variante seleccionada

```typescript
interface Props {
  variantes: VariantePiloto[];
  precioBase: number;
}

// Mostrar: Grid interactivo con talla/color/marca
// Salida: { talla, color, marca_piloto, cantidad_stock, precioFinal }
```

---

#### 2. **Filtro de Motos** (`src/components/FiltroMotos.tsx`)

Panel de filtros específico para productos motos.

**Responsabilidades:**
- Listar marcas de motos (relación)
- Listar modelos por marca (relación)
- Filtro de precio
- Aplicar filtros y actualizar URL

---

#### 3. **Filtro de Pilotos** (`src/components/FiltroPilotos.tsx`)

Panel de filtros específico para productos pilotos.

**Responsabilidades:**
- Listar tallas (ENUM)
- Listar marcas piloto (ENUM)
- Listar colores disponibles (dinámico)
- Filtro de precio
- Toggle: Solo marca genérica vs de marca

---

#### 4. **Componente SEO** (`src/components/MetatagsSEO.astro`)

Reutilizable para todas las páginas.

**Responsabilidades:**
- Usar `metadatos_seo` de Strapi
- Generar Open Graph automático
- Generar Schema Markup (Product, BreadcrumbList)
- Canonical URLs

---

#### 5. **Breadcrumbs Jerárquicos** (`src/components/BreadcrumbsJerarquicos.astro`)

Mejorar el componente existente `MigasPan`.

**Responsabilidades:**
- Para motos: Inicio > Motos > Marca > Modelo > Producto
- Para pilotos: Inicio > Piloto > Categoría > Producto
- Schema Markup BreadcrumbList
- Enlaces correctos

---

### 📝 Plan de Actualización Detallado

#### Fase 1: Fundación (Tipos y Utilidades)

1. **Actualizar `src/lib/strapi.ts`**
   - [ ] Cambiar a GraphQL
   - [ ] Crear funciones específicas por tipo
   - [ ] Agregar caché

2. **Actualizar `src/store/cart.ts`**
   - [ ] Separar tipos de items
   - [ ] Agregar lógica de variantes

**Duración:** 2-3 horas

---

#### Fase 2: Componentes Core

3. **Crear `SelectorVariantes.tsx`**
   - [ ] Renderizar matriz interactiva
   - [ ] Validación de stock
   - [ ] Cálculo de precio dinámico

4. **Actualizar `AddToCart.tsx`**
   - [ ] Integrar selector de variantes
   - [ ] Validación de stock

5. **Actualizar `CartDrawer.tsx`**
   - [ ] Mostrar detalles de variantes
   - [ ] Cálculo correcto de precios

**Duración:** 4-5 horas

---

#### Fase 3: Páginas

6. **Crear rutas `/motos/` y `/piloto/`**
   - [ ] Separar lógica de catálogo
   - [ ] Crear filtros específicos
   - [ ] Actualizar queries GraphQL

7. **Actualizar página de detalle**
   - [ ] Detectar tipo de producto
   - [ ] Mostrar variantes o compatibilidad
   - [ ] Schema Markup

8. **Crear componentes de filtro**
   - [ ] `FiltroMotos.tsx`
   - [ ] `FiltroPilotos.tsx`

**Duración:** 6-8 horas

---

#### Fase 4: SEO y Optimización

9. **Implementar SEO**
   - [ ] Meta tags desde Strapi
   - [ ] Sitemap dinámico
   - [ ] Schema Markup completo
   - [ ] Breadcrumbs jerárquicos

**Duración:** 3-4 horas

---

### 🚀 Dependencias Entre Tareas

```
Fase 1 (Strapi + Store)
    ↓
Fase 2 (Componentes)
    ↓
Fase 3 (Páginas + Rutas)
    ↓
Fase 4 (SEO)
```

**Nota:** Las tareas de Fase 2 y 3 pueden paralelizarse parcialmente si hay dos desarrolladores.

---

### ✅ Criterios de Aceptación por Componente

#### AddToCart.tsx
- [ ] Muestra selector de variantes para pilotos
- [ ] Valida stock antes de agregar
- [ ] Calcula precio correcto con modificador
- [ ] Agrega item correcto al store (tipo + detalles)

#### CartDrawer.tsx
- [x] Muestra detalles de variantes (talla, color, marca)
- [x] Calcula total correcto (incluye modificador)
- [x] Permite editar cantidad (+ y − botones)
- [x] Permite eliminar items
- [x] Integración WhatsApp funcional
- [x] Alerta visual de stock bajo
- [x] Muestra SKU y compatibilidad (moto)

#### Página de Motos
- [ ] URL: `/motos`
- [ ] Filtros: marca, modelo, precio
- [ ] Listado de productos `producto-moto`
- [ ] Breadcrumbs correctos
- [ ] Meta tags SEO

#### Página de Pilotos
- [ ] URL: `/piloto`
- [ ] Filtros: talla, marca_piloto, color, precio
- [ ] Listado de productos `producto-piloto`
- [ ] Breadcrumbs correctos
- [ ] Meta tags SEO

#### Detalle de Producto
- [ ] Detecta tipo (moto vs piloto)
- [ ] Para moto: muestra marca + modelo
- [ ] Para piloto: selector de variantes funcional
- [ ] Schema Markup correcto
- [ ] Breadcrumbs jerárquicos
- [ ] Meta tags desde `metadatos_seo`
