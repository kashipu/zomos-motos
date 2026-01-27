# Arquitectura Frontend - Zomos Motos Storefront (Astro)

## Stack Tecnológico
- **Framework:** [Astro](https://astro.build/) (version 4+)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes UI:** shadcn/ui + Lucide Icons (integrado vía React)
- **Estado Local:** Nanostores (ligero y compatible con Astro/React)
- **Data Fetching:** Fetch API estándar (en componentes Astro para SSG/SSR)

## Estructura de Directorios
```
/storefront
  /src
    /pages         # Rutas (index.astro, productos/[slug].astro)
    /components    # Componentes .astro y .tsx
      /ui          # shadcn/ui (React)
      /common      # Header, Footer
    /layouts       # Layout base (Layout.astro)
    /lib           # Clientes API (strapi.ts)
    /store         # Nanostores para el carrito
  /public          # Assets estáticos
```

## Funcionalidades Clave

### 1. Catálogo (Astro Pages)
- **Listado:** Generado estáticamente o mediante SSR para máxima velocidad.
- **Detalle:** Uso de parámetros dinámicos para slugs de productos.
- **Islands:** El selector de variantes y fotos puede ser un componente interactivo.

### 2. Carrito (Nanostores)
- El carrito se gestiona mediante Nanostores para que sea accesible tanto desde componentes Astro como desde componentes React (islas).
- Persistencia en `localStorage`.

### 3. Checkout WhatsApp
- Botón interactivo que recopila los datos del carrito.
- Llamada a `POST /api/checkout/whatsapp` en Strapi.
- Redirección final gestionada por el backend.

## Notas de Implementación
- **Optimización:** Usar el componente `<Image />` nativo de Astro.
- **SEO:** Metadata autogenerada en el layout base y páginas de producto.
- **React en Astro:** Configurar la integración de React para usar shadcn (@astrojs/react).
