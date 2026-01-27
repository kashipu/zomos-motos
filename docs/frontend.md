# Arquitectura Frontend - Zomos Motos Storefront (Astro 5)

## Stack Tecnológico
- **Framework:** [Astro](https://astro.build/) (v5.0+)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes UI:** React 18 + Lucide Icons
- **Estado Local:** Nanostores (con persistencia local)

## Componentes Críticos (React Islands)

### 1. `AddToCart.tsx`
Botón hidratado en el cliente que añade ítems al carrito.
- **Dato:** Incluye `sku`, `price` e `image`.
- **Estado:** Interactúa con el store de Nanostores.

### 2. `CartDrawer.tsx`
Isla reactiva que maneja el resumen de compra y totales.
- **Checkout:** Llama al backend (puerto 1338) para registrar el `INTENT`.
- **Imágenes:** Procesa las URLs de Strapi usando el helper local.

## Integración y Utilidades
Ubicadas en `src/lib/strapi.ts`:

- **queryStrapi:** Función genérica para obtener datos del CMS.
- **getStrapiMedia:** Resuelve automáticamente las URLs de las imágenes, manejando el prefijo del host de Strapi (útil para desarrollo local).

## Gestión de Estado (Nanostores)
El store se define en `src/store/cart.ts` usando `@nanostores/persistent`. Esto garantiza que los clientes no pierdan su carrito al navegar por la web o recargar la página.
