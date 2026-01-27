# Contexto del Producto - Zomos Motos

Este documento define la visión del producto y el alcance del MVP "Hello-World".

> **Documentación Técnica y Guías:**
> Para detalles de implementación, arquitectura e instalación, consulta los siguientes documentos:
> - 🏗️ **[Arquitectura General](architecture.md)**: Diagramas, decisiones de stack y principios.
> - 🚀 **[Guía de Instalación Local](setup_guide.md)**: Paso a paso para levantar el proyecto.
> - 💻 **[Frontend (Storefront)](frontend.md)**: Estructura y componentes Next.js.
> - ⚙️ **[Backend (Commerce API)](backend.md)**: Configuración Medusa.js y Base de Datos.
> - ☁️ **[Despliegue (Deploy)](deploy.md)**: Configuración VPS y Dokploy.

---

## Contexto del Negocio
Tienda enfocada en:
- Accesorios para motocicletas y pilotos (cascos, guantes, chaquetas, intercomunicadores, maletas, etc.)
- **NO** repuestos ni mecánica.

**Objetivo del MVP/Hello-World:**
- Experiencia tipo ecommerce (catálogo + carrito)
- Sin pasarela de pagos (por ahora)
- La “compra” se ejecuta vía WhatsApp (Click-to-Chat) enviando el contenido del carrito + un ID de pedido
- Catálogo administrable por una persona NO técnica
- Compatibilidad importante:
  - Piloto: tallas (S/M/L…)
  - Moto: compatible por modelo de moto (y opcionalmente año), o universal

**Restricciones:**
- Self-host en un único VPS (Dokploy)
- Medios (fotos/videos) en almacenamiento local (volúmenes) por ahora
- Debe poder escalar a grande en el futuro (sin rehacer la base)

---

## Definición de “Hello-World” (Resultado Verificable)
✅ Fase completada satisfactoriamente.

1.  **[x] Storefront Web (Frontend)**
    - Home / listado / detalle de producto (Astro)
    - Carrito (Nanostores + React)
    - Botón “Comprar por WhatsApp” integrado.

2.  **[x] Backend (API + admin)**
    - CRUD de productos en Strapi v5.
    - Subida de imágenes con población automática.
    - Endpoint para creación de eventos de tracking único.

3.  **[x] Tracking Robusto de WhatsApp**
    - Registro de intención (`INTENT`) y apertura (`OPEN`).
    - Redirección inteligente mediante códigos cortos (`ZM-XXXXX`).
    - Mensajes formateados con SKU, precios y total en COP.

---

## Tracking de WhatsApp (Requisito Central)

### Qué queremos medir
- **“Intent”**: el usuario hizo click en “Comprar por WhatsApp”
- **“Open”**: el usuario llegó al paso que abre WhatsApp

### Estrategia (Proxy Fuerte)
1.  **Click Frontend:** Usuario clickea "Comprar". Frontend llama a `POST /api/checkout/whatsapp`.
2.  **Registro Intent:** Backend crea orden (draft), registra `WA_INTENT` y devuelve URL única: `https://dominio.com/wa/<tracking_id>`.
3.  **Redirección:** Frontend navega a esa URL.
4.  **Registro Open:** Backend recibe petición en `/wa/<tracking_id>`, registra `WA_OPEN` y redirige (302) a `wa.me` con el mensaje pre-llenado.

### Datos del Evento
- `event_type`: `WA_INTENT` | `WA_OPEN`
- `tracking_id`: Código corto legible (ej: `MOTO-8F3K2`)
- `cart_summary`: Snapshot del carrito (JSON)
- `utm_*`: Parámetros de campaña

---

## Roadmap Fase 2 (Futuro)
- Modelo formal de compatibilidad `fitment_rules` (make/model/year)
- Búsqueda avanzada (Meilisearch)
- Multi-sede (inventario por sede)
- Pasarela de pagos real
- AI Service (RAG)