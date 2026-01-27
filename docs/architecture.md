# Arquitectura del Sistema - Zomos Motos

## Descripción General
El sistema utiliza una arquitectura **Headless Commerce** adaptada para el máximo rendimiento. Strapi actúa como el motor de contenidos y lógica de negocio (Backend), mientras que **Astro** sirve el Storefront optimizado. Todo el ecosistema corre sobre **Bun**.

```mermaid
graph TD
    User[Usuario] -->|Navega| Storefront[Storefront (Astro)]
    Storefront -->|REST API| Strapi[Strapi CMS]
    Strapi -->|Persistencia| DB[(PostgreSQL)]
    Strapi -->|Cache/Task Queues| Redis[(Redis - Opcional)]
    Strapi -->|Notificaciones| WA[WhatsApp Click-to-Chat]
```

## Componentes Principales

### 1. Backend: Strapi
**Por qué:**
- **Flexibilidad:** Permite definir tipos de contenido (Productos, Eventos de WhatsApp) en segundos.
- **Admin UI:** Interfaz amigable para que el equipo de Zomos Motos gestione el catálogo sin tocar código.
- **WhatsApp Tracking:** Lógica personalizada mediante controladores para registrar la conversión en el embudo.
- **Bun Ready:** Ejecución eficiente y rápida sobre el runtime de Bun.

### 2. Frontend: Astro
**Por qué:**
- **Rendimiento:** Generación de sitios estáticos (SSG) de ultra-carga y "Islands Architecture".
- **Interactividad:** Permite usar React (shadcn/ui) solo donde sea necesario, reduciendo el JS enviado al cliente.
- **SEO:** Estructura optimizada nativamente para buscadores.
- **Desarrollo:** DX moderna con soporte nativo para TypeScript y Tailwind.

### 3. Base de Datos & Infraestructura
- **PostgreSQL:** El motor de base de datos relacional robusto.
- **Redis:** (Opcional) Para caché de API y colas de tareas.
- **Docker:** Contenerización de todos los servicios para paridad absoluta entre desarrollo y producción.
- **Dokploy:** Orquestador simplificado para gestionar despliegues, volúmenes y certificados SSL.

## Flujo de Datos y Conversión

1.  **Catálogo:** Astro consume productos de Strapi (`/api/products`) con población automática de imágenes.
2.  **Tracking de WhatsApp (Embudo):**
    - **INTENT (Click):** Cuando el usuario pulsa "Finalizar por WhatsApp", el frontend genera un evento en el backend enviando el snapshot del carrito. Se genera un `tracking_id` único (ej: `ZM-5K8A2`).
    - **OPEN (Seguimiento):** El backend devuelve una URL de redirección: `http://localhost:1338/api/wa/ZM-5K8A2`.
    - **Redirección:** Al acceder a esa URL, el backend registra el evento `OPEN` y redirige al usuario a la API de WhatsApp con el mensaje pre-formateado.

## Resumen de Mensaje WhatsApp
El mensaje enviado incluye:
- Referencia de pedido.
- Lista detallada de productos (Nombre, SKU, Cantidad).
- Desglose de precios unitarios y subtotales.
- Total de la compra en formato moneda de Colombia (COP).
