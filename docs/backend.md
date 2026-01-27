# Arquitectura Backend - Zomos Motos API (Strapi)

## Stack Tecnológico
- **Core:** [Strapi v5+](https://strapi.io/) - Runtime: **Bun**
- **Base de Datos:** PostgreSQL
- **Cache:** Redis (Opcional)
- **Almacenamiento:** Strapi Local Upload Provider (Volumen Docker)

## Estructura de Datos (Content Types)

### 1. Producto (Product)
- **Basic:** Nombre, Descripción, Precio, SKU.
- **Media:** Galería de Imágenes (Strapi Media Library).
- **Relations:** Categorías, Variantes (Componentes o Colección relacionada).
- **Metadatos:** Compatibilidad (Moto, Año).

### 2. Evento WhatsApp (WhatsAppEvent) - *Custom API*
Colección para trackear el embudo de ventas.
- `type`: Enumeration (`INTENT`, `OPEN`)
- `tracking_id`: UID único
- `payload`: JSON (Carrito, UTMs)

## Servicios Personalizados

### WhatsApp Tracking logic
Implementado vía controladores personalizados en Strapi:

#### Endpoints
- `POST /api/checkout/whatsapp`
  - **Input:** JSON con items del carrito y metadatos.
  - **Lógica:**
    1.  Genera un `tracking_id` (ej: `ZM-5542`).
    2.  Crea un registro en `WhatsAppEvent` con tipo `INTENT`.
    3.  Retorna la URL de redirección: `/api/wa/{tracking_id}`.

- `GET /api/wa/:tracking_id`
  - **Lógica:**
    1.  Busca el evento original por `tracking_id`.
    2.  Crea un nuevo registro `WhatsAppEvent` con tipo `OPEN`.
    3.  Construye el mensaje de WhatsApp.
    4.  Redirige (302) a `wa.me`.

## Seguridad
- **Admin:** Protegido por Strapi Auth System.
- **API:** Uso de API Tokens o acceso público configurado en Roles & Permissions.
- **CORS:** Configurado en `config/middlewares.js` para permitir el Storefront.

## Por qué Bun?
- **Velocidad:** Strapi arranca y recarga (hot-reload) mucho más rápido con Bun.
- **Gestión de dependencias:** Instalación casi instantánea.
- **Native Fetch:** Mejor rendimiento en llamadas externas.
