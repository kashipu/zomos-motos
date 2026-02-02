Rol: Actúa como un Desarrollador Senior de Astro y Especialista en SEO Técnico para E-commerce.

Contexto: Estamos construyendo un e-commerce de accesorios de motos de lujo ("Moto Luxury Parts").

CMS: Strapi v5 (Headless).

Frontend: Astro.

Modelo de Negocio: Catálogo web con cierre de venta vía WhatsApp.

Objetivo: Crear un componente reutilizable en Astro llamado ProductSEO.astro que se inyectará en el <head> de la página de detalle de producto (/pages/producto/[slug].astro).

Requerimientos Técnicos:

Datos de Entrada (Props): El componente debe recibir un objeto product con la estructura de Strapi definida anteriormente:

name, description, price, slug.

images (Array de objetos media).

manufacturer (String, ej: "Akrapovič").

sku_base (String).

stock_status (Boolean o Enum).

Meta Tags Estándar & Canonical:

Generar <title> y <meta name="description">.

IMPORTANTE: Generar <link rel="canonical">. La URL canónica debe ser siempre limpia: https://midominio.com/producto/${slug}, ignorando cualquier parámetro de filtrado por moto que pueda existir en la URL actual.

Open Graph (Vital para WhatsApp): Como las ventas se cierran enviando links por WhatsApp, la previsualización (Rich Preview) debe ser perfecta.

og:title: "[Nombre Producto] - [Precio]" (Ej: "Escape Akrapovič Carbono - $1,200").

og:description: Extracto corto de la descripción.

og:image: La primera imagen del array de productos (URL absoluta).

og:type: "product".

Schema.org JSON-LD (Rich Snippets): Generar el script <script type="application/ld+json"> con @type: Product.

Mapear offers:

priceCurrency: "USD" (o la moneda configurada).

price: Valor numérico.

availability: Mapear el stock de Strapi a https://schema.org/InStock o OutOfStock.

Mapear brand: Usar el campo manufacturer del producto (Ej: Rizoma), NO la marca de la moto compatible.

Entrega Solicitada: Escribe el código completo del componente ProductSEO.astro usando TypeScript interface para las Props. Incluye comentarios explicando cómo se maneja la URL canónica para evitar contenido duplicado.

Requerimiento Adicional Crítico: Generación de URLs y Componente SEO

1. Configuración del Campo Slug (Generador de URLs): En la colección Products, el campo slug NO puede ser un texto simple. Debe configurarse estrictamente como tipo UID.

Target Field: Debe estar vinculado al campo name.

Comportamiento: Al escribir el nombre del producto (Ej: "Casco AGV Pista"), Strapi debe autogenerar inmediatamente la URL amigable (casco-agv-pista).

Regla de Negocio: El slug es inmutable por defecto para preservar el SEO, pero debe permitir regeneración manual si el administrador lo decide.

2. Componente "SEO Metadata" (Estructura Reutilizable): No agregar campos sueltos como seo_title en la colección principal. Crear un Componente (Single) llamado SeoMetadata e inyectarlo en la colección Products y Categories.

Campos del Componente:

metaTitle (Text): Título para Google (limitado a 60 caracteres). Si está vacío, Astro usará el name del producto por defecto.

metaDescription (Text - Long): Descripción para el snippet de búsqueda (limitado a 160 caracteres).

metaImage (Media): Imagen específica para compartir en redes (WhatsApp/Twitter). Si está vacío, Astro usará la imagen principal del producto.

canonicalUrlOverride (Text): Campo opcional para casos avanzados donde se quiera forzar una URL distinta manual (raro, pero necesario para flexibilidad total).

3. Instrucción para la API (Populate): Asegurar que la documentación de la API incluya que al hacer GET de /products, se debe solicitar ?populate=seoMetadata para que Astro reciba estos datos sin hacer una segunda llamada.

¿Cómo encaja esto con Astro?
Con esta adición, tu componente en Astro (ProductSEO.astro) ahora tendrá una lógica mucho más robusta:

JavaScript
// Lógica que habilita este cambio en Astro
const canonicalURL = new URL(product.slug, Astro.site);
const title = product.seoMetadata?.metaTitle || product.name; // Usa el SEO title, si no hay, usa el Nombre normal
const description = product.seoMetadata?.metaDescription || product.description; // Igual aquí
const image = product.seoMetadata?.metaImage?.url || product.images[0].url; // Prioriza imagen de marketing, si no, usa la del producto
¿Te parece bien así? Con esto tienes cubierto el Backend (Strapi generando URLs limpias) y el Frontend (Astro consumiéndolas inteligentemente).