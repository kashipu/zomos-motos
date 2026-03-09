# Diseño de formularios - Colecciones Strapi

## Categorías

- **nombre** (string) — Único, requerido
- **slug** (uid) — Auto-generado desde nombre
- **tipo** (enum) — `MOTO` | `PILOTO`, requerido
- **descripcion** (text) — Opcional

**Colección:** `categoria` → `categorias`

---

## Marcas (Equipamiento)

- **nombre** (string) — Único
- **slug** (uid) — Auto-generado desde nombre
- **logo** (media) — Imagen del logo

**Colección:** `marca` → `marcas`

---

## Marcas de Moto

- **nombre** (string) — Único
- **slug** (uid) — Auto-generado desde nombre
- **logo** (media) — Imagen del logo
- **modelos** (relación) — One-to-many → `modelo-moto`

**Colección:** `marca-moto` → `marcas_moto`

---

## Modelos de Moto

- **nombre** (string) — Requerido
- **slug** (uid) — Auto-generado desde nombre
- **marca** (relación) — Many-to-one → `marca-moto`, requerido
- **anio_desde** (integer) — Año inicial de producción
- **anio_hasta** (integer) — Año final (null = actual)

**Colección:** `modelo-moto` → `modelos_moto`

---

## Producto Moto

- **nombre** (string) — Requerido
- **slug** (uid) — Auto-generado desde nombre
- **referencia** (string) — SKU único
- **categoria** (relación) — Many-to-one → `categoria`, requerido
- **marca** (relación) — Many-to-one → `marca`, opcional
- **precio** (decimal) — Requerido
- **descuento** (integer) — 0–100 (%)
- **imagenes** (media) — Múltiples imágenes
- **descripcion** (richtext) — Descripción larga
- **compatibilidades** (componente repetible) — `tienda.compatibilidad-moto`
- **metadatos_seo** (componente único) — `compartido.metadatos-seo`

**Colección:** `producto-moto` → `productos_moto`

### Componente: Compatibilidad Moto (`tienda.compatibilidad-moto`)

- **marca_moto** (relación) — → `marca-moto`, requerido
- **modelo_moto** (relación) — → `modelo-moto`, requerido

---

## Producto Piloto

- **nombre** (string) — Requerido
- **slug** (uid) — Auto-generado desde nombre
- **referencia** (string) — SKU único
- **categoria** (relación) — Many-to-one → `categoria`, requerido
- **marca** (relación) — Many-to-one → `marca`, opcional
- **precio** (decimal) — Requerido
- **descuento** (integer) — 0–100 (%)
- **imagenes** (media) — Múltiples imágenes
- **descripcion** (richtext) — Descripción larga
- **variantes_piloto** (componente repetible) — `tienda.variante-piloto`
- **metadatos_seo** (componente único) — `compartido.metadatos-seo`

**Colección:** `producto-piloto` → `productos_pilotos`

### Componente: Variante Piloto (`tienda.variante-piloto`)

- **talla** (enum) — `XS` | `S` | `M` | `L` | `XL` | `XXL` | `UNICA`
- **color** (string) — Nombre del color
- **cantidad_stock** (integer) — Stock disponible

---

## Componente: Metadatos SEO (`compartido.metadatos-seo`)

- **titulo_meta** (string) — Máx. 60 caracteres
- **descripcion_meta** (string) — Máx. 160 caracteres
- **imagen_meta** (media) — Imagen para OG/Twitter
- **url_canonica_personalizada** (string) — Override de URL canónica

---

## Pedidos

- **tracking_id** (string) — ID único del pedido (ZM-XXXXX), requerido
- **estado** (enum) — `PENDIENTE` | `CONTACTADO` | `COMPLETADO` | `CANCELADO`
- **cliente_nombre** (string) — Requerido
- **cliente_telefono** (string) — Requerido
- **cliente_correo** (string) — Opcional
- **cliente_cedula** (string) — Requerido
- **cliente_direccion** (text) — Requerido
- **autorizacion_datos** (boolean) — Requerido
- **items** (json) — Array de items del carrito
- **monto_total** (decimal) — Requerido
- **marcas_moto_meta** (json) — Array de marcas de moto del pedido
- **fecha_pedido** (datetime) — Requerido
- **whatsapp_enviado** (boolean) — Default false
- **fecha_whatsapp** (datetime) — Cuando se abrió el link de WhatsApp

**Colección:** `pedido` → `pedidos`

---

## WhatsApp Event

- **type** (enum) — `INTENT` | `OPEN`
- **tracking_id** (string) — ID de tracking
- **payload** (json) — Datos del evento

**Colección:** `whats-app-event` → `whats_app_events`
