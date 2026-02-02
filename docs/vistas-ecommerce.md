# Arquitectura de Vistas: Zomos Motos E-commerce

Este documento define la estructura de páginas, componentes y lógica necesaria para el frontend de Zomos Motos, basándose en el [Modelo de Datos](modelo-datos.md) y los diseños de referencia en `front-design/`.

## 1. Mapa de Páginas (Screens)

### 1.1 Landing Inicial (Home)

- **Ruta:** `/`
- **Fuente de Diseño:** `front-design/premium_moto_showcase_landing_page`

- **Secciones Clave:**
  - **Hero:** Impacto visual con soporte de imágenes responsivas (Desktop, Tablet, Mobile) gestionadas desde Strapi.
  - **Barra de Beneficios:** Envíos, Calidad, Soporte. (Componente estático).
  - **Explorador de Categorías:** Enlaces directos a "PILOTO" y "MOTO".
  - **Productos Destacados:** Grid visual basado en el diseño de landing.
  - **Newsletter:** Captura de leads.

### 1.2 Catálogo de Productos (Categoría)

- **Ruta:** `/productos` o `/productos?category=slug`
- **Fuente de Diseño:** `front-design/moto_&_pilot_product_catalog`

- **Lógica de Transformación:**
  - Switch dinámico entre modo **PILOTO** (filtros de Talla, Atributos) y modo **MOTO** (filtros de Marca, Modelo, Año).

- **Componentes:**
  - `SidebarFilter`: Filtros reactivos basados en el `type` de la categoría.
  - `ProductGrid`: Lista paginada con ordenamiento (Precio, Novedad).
  - `CategoryTabs`: Cambio rápido entre Piloto y Moto.

### 1.3 Vista de Detalle de Producto

- **Ruta:** `/productos/[slug]`
- **Fuente de Diseño:** `front-design/product_detail_view`

- **Lógica Crítica:**
  - **Matriz de Compatibilidad:** Para productos `type === 'MOTO'`, mostrar Marca/Modelo/Año compatibles.
  - **Variantes:** Selección de Tallas (con stock individual) para productos `type === 'PILOTO'`.
  - **WhatsApp Checkout:** Botón que envía el nombre del producto, referencia y variante seleccionada.

### 1.4 Checkout Visual

- **Ruta:** `/checkout`
- **Fuente de Diseño:** `front-design/visual_checkout_experience`

- **Lógica:**
  - Resumen del carrito (Persistencia en `nanostores`).
  - Formulario de contacto (Nombre, Teléfono, Ciudad).
  - Selección de Método de Pago (Informativo).
  - Integración con Evento de WhatsApp (Finalizar enviando el pedido completo).

### 1.5 Confirmación de Pedido

- **Ruta:** `/checkout/success` (o similar)
- **Fuente de Diseño:** `front-design/order_confirmation_&_contact`

- **Lógica:**
  - Resumen final del pedido registrado.
  - Botón secundario para contactar a un experto vía WhatsApp si hay dudas.

---

## 2. Componentes a Desarrollar / Refactorizar

> [!NOTE]
> La fase inicial se centrará en la **implementación visual** (Pure CSS + HTML/Astro) replicando los diseños de `front-design/`. La lógica de negocio (filtros, variantes, cart) se añadirá en una fase posterior.

| Componente | Estado | Descripción |
| :--- | :--- | :--- |
| `Header` | ⚠️ Básico | Refactorizar según diseño "Moto Premium" (vibrant red/dark). |
| `Hero` | ❌ Pendiente | Imagen estática responsiva (3 fuentes: Desktop/Tablet/Mobile). |
| `ProductCard` | ⚠️ Parcial | Refactorizar visualmente según el diseño del catálogo. |
| `SidebarFilter` | ❌ Pendiente | Implementación visual del sidebar de filtros. |
| `CompatibilityMatrix` | ❌ Pendiente | Maquetación visual para detalle de producto. |
| `VariantSelector` | ❌ Pendiente | Maquetación visual de tallas/colores. |
| `CheckoutForm` | ❌ Pendiente | Maquetación visual del formulario de 2 columnas. |
| `Footer` | ⚠️ Básico | Refactorizar según diseño Premium. |

---

## 3. Lógica de Negocio Pendiente

1. **Integración de `product_variants` (Compuestas):** El frontend debe permitir seleccionar múltiples atributos (ej: Talla Y Color). La lógica debe buscar la variante que coincida con la combinación elegida para mostrar su `stock_status` y `price_modifier`.
2. **Costo de Envío:** No se calcula en el frontend. En el checkout se informa que el costo se acordará por WhatsApp.
3. **Gestión de Stock:** Se debe mostrar un estado visual de "Agotado" si la variante/producto no está disponible, pero no es necesario llevar un conteo numérico de existencias.
4. **Productos Destacados (Colección Independiente):** No se usará un flag en `Products`. Se creará una nueva colección (ej: `FeaturedProducts` o `HomeShowcase`) en Strapi para elegir manualmente qué productos aparecen en la landing.

---

## 4. Preguntas para el Usuario

1. **¿Múltiples Variantes?** ¿Un producto puede tener más de una variante seleccionable simultáneamente (ej: Talla Y Color)?
2. **¿Cálculo de Envío?** ¿El envío siempre es gratis (como dice el diseño) o depende de la ciudad?
3. **¿Gestión de Stock?** ¿Deseas que el botón de "Añadir al carrito" se bloquee si la variante está "Agotada" en Strapi?
4. **¿Imágenes de Diseño?** ¿Quieres que usemos las imágenes de los placeholders de los diseños o prefieres que generemos imágenes nuevas con AI para el contenido real?
