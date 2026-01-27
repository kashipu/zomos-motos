# Arquitectura Backend - Zomos Motos API (Strapi v5)

## Stack Tecnológico
- **Core:** [Strapi v5+](https://strapi.io/) - Runtime: **Bun**
- **Base de Datos:** PostgreSQL
- **Puerto local:** 1338 (para evitar conflictos en Windows)

## Estructura de Datos (Content Types)

### 1. Producto (Product)
- **Campos:** Nombre, Descripción, Precio, SKU, Imágenes.
- **Relaciones:** Categoría (Many-To-One).
- **Populado automático:** Las imágenes se incluyen por defecto en las consultas desde el Storefront.

### 2. Evento WhatsApp (WhatsAppEvent)
Colección para trackear el embudo de ventas.
- **Tipo:** `INTENT` (Click en carrito) o `OPEN` (Llegada a WhatsApp).
- **ID de seguimiento:** `tracking_id` (String no único para permitir historial de eventos por código).
- **Payload:** JSON con el snapshot del carrito en el momento del evento.

## Lógica y Endpoints Personalizados

### 1. Intento de Compra (`POST /api/checkout/whatsapp`)
- **Acción:** Registra un evento `INTENT`.
- **Retorno:** Devuelve una URL absoluta (usando `PUBLIC_STRAPI_URL`) hacia el proxy de seguimiento.

### 2. Proxy de Redirección (`GET /api/wa/:tracking_id`)
- **Acción:** Registra el evento `OPEN`.
- **Mensaje:** Construye un mensaje profesional en WhatsApp usando datos del carrito y formato Unicode para asegurar compatibilidad de emojis.
- **Redirección:** Envía al usuario a `wa.me` con el número configurado en `WHATSAPP_NUMBER`.

## Automatización (Bootstrap)
El sistema incluye lógica en `src/index.ts` para:
- **Seed automático:** Carga productos iniciales desde `seed_products.json`.
- **Gestión de Permisos:** Configura automáticamente los roles públicos para permitir `find` y `findOne` en productos y categorías sin intervención manual.
