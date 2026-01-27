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

## Flujo de Datos
1.  **Carga de Productos:** Strapi entrega el JSON mediante `/api/products`.
2.  **Generación de Sitio:** Astro consume la API en tiempo de construcción (SSG) o ejecución (SSR).
3.  **Conversión:** El carrito (React Island) interactúa con el backend para iniciar el flujo de WhatsApp.
