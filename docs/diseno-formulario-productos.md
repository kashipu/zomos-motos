# Diseño Intuitivo del Formulario de Productos (Zomos Motos)

Este documento describe la configuración ideal del panel de Strapi para garantizar una carga de datos rápida, sin errores y consistente entre productos de **MOTO** y **PILOTO**.

## 🎯 Objetivo: El "Flujo de Preguntas"

Para que el formulario sea intuitivo, debemos configurarlo para que guíe al administrador como si fuera una encuesta.

### 1. Configuración de la Vista Principal (Product View)

En el panel de Strapi, haz clic en **"Configure the view"** (abajo a la izquierda) y organiza los campos en este orden vertical:

| Orden | Campo | Etiqueta Sugerida (Label) | Propósito |
| :--- | :--- | :--- | :--- |
| **1** | `tipo_producto` | **¿Para quién es el producto?** | Identifica el flujo de carga inmediatamente |
| **2** | `nombre` | Nombre del Producto | Identidad básica |
| **3** | `categoria` | Categoría | Define la lógica interna |
| **4** | `precio` | Precio | Datos transaccionales |
| **5** | `referencia` | Referencia / SKU | Control de inventario |
| **6** | `imagenes` | Imágenes | Galería visual |
| **7** | `descripcion` | Descripción | Información detallada |

---

### 2. Bloques de Especialidad (Secciones)

Divide visualmente el formulario configurando los campos de relación y componentes:

#### SECCIÓN MOTO (Solo si elegiste MOTO)

- `motos_compatibles`: Colócalo después de la descripción.
- `detalle_compatibilidad`: Justo debajo de motos compatibles.

#### SECCIÓN PILOTO (Solo si elegiste PILOTO)

- `variantes_producto`: Colócalo al final de todo. Es el bloque más grande y requiere atención para las tallas.

---

### 3. Ajuste de Componentes (Establecer diseño)

Para las **Variantes de Producto**, configuraremos Strapi para que los campos principales aparezcan en **una sola fila**. Esto permite comparar variantes rápidamente sin hacer scroll.

1.  Haz clic en el engranaje de `variantes_producto`.
2.  Organiza los campos en este orden (y arrástralos para que compartan fila):
    *   `talla` | `color` | `estado_stock` (Recomendado en una sola fila)
    *   `referencia_variante` | `modificador_precio` (En la fila de abajo)
    *   `material` | `acabado` (Opcionales, al final)

### 4. Formulario Dinámico (Campos Condicionales) ⚡

¡Esta es la joya de la corona! Strapi permite ocultar campos que no necesitas. Por ejemplo, si es para **PILOTO**, no tiene sentido ver campos de **MOTO**.

#### Cómo configurarlo:

> [!IMPORTANT]
> Las condiciones se ponen **EN EL CAMPO QUE QUIERES OCULTAR**, no en el disparador (`tipo_producto`).

1.  En **"Configure the view"**, haz clic en el engranaje del campo que quieres que sea dinámico (ej: `variantes_producto`).
2.  Ve a la pestaña **"Ajustes Avanzados"** (Advanced Settings).
3.  En la sección **"Condition"**, haz clic en **"+ Apply condition"**.
4.  Configura así:
    *   **Field:** `tipo_producto`
    *   **Operator:** `is`
    *   **Value:** `PILOTO`
5.  Repite lo mismo para los campos de Moto (`motos_compatibles` y `detalle_compatibilidad`), pero con el valor `MOTO`.

**Resultado:** Cuando el administrador seleccione "¿Para quién es el producto?", el formulario "mágicamente" mostrará solo las secciones necesarias. El formulario queda limpio y profesional.

### 5. Filtro de Marcas y Modelos 🏍️

Para que el administrador no se pierda entre cientos de modelos, hemos añadido una relación de **Marca** en el producto.

#### Flujo de trabajo recomendado:

1.  **Paso A (Marca):** Selecciona la `marca_moto` (ej: Yamaha).
2.  **Paso B (Modelos):** En `motos_compatibles`, selecciona los modelos específicos.
    - **Pro Tip:** Puedes escribir el nombre de la marca en el buscador de modelos para filtrar visualmente (ej: escribe "Honda" y aparecerán solo las CB, XR, etc.).

### 6. Caso Práctico: Accesorios para Pulsar NS 200 🛠️

Entiendo perfectamente: para ti, la moto es el "padre" de los accesorios. Así es como debes cargar, por ejemplo, un protector de radiador para la **NS 200**:

1.  **¿Para quién es?:** `MOTO`.
2.  **Categoría:** `Protecciones` (Tipo MOTO).
3.  **Marca de la Moto:** `Bajaj`.
4.  **Motos Compatibles:** Buscas `NS 200`.

> [!TIP]
> **Convención de Nombres (Data Entry):** 
> Para que el buscador sea ultra-rápido, te recomiendo que en la colección de **Modelos de Moto**, nombres los registros como `[Marca] [Modelo]`. 
> Ejemplo: En lugar de solo `NS 200`, llámalo `Bajaj NS 200`. 
> Así, al escribir "Bajaj" en el buscador de relaciones, te saldrán todos sus modelos de golpe.

---

### 🛡️ Reglas de Oro para Evitar Errores

1. **Mira el PASO 1:** Si marcaste **MOTO**, ignora completamente el bloque de `variantes_producto` (el sistema no te dejará guardar si lo llenas).
2. **Validaciones Automáticas:** El sistema ya tiene "policías" internos. Si intentas guardar un producto de Piloto sin tallas, Strapi te avisará con un mensaje en rojo.
3. **Filtro de Marca:** Siempre elige primero la `marca_moto`. Esto ayudará en el futuro a que el sitio web sea mucho más rápido para tus clientes.

---

---

## 🛠️ Reparar la Vista (Si ves "Untitled" o IDs) 🔧

Al cambiar los nombres internos de los campos (ej: de `name` a `nombre`), Strapi puede "olvidar" qué campo mostrar como título.

### 1. Corregir "Untitled" y los IDs en las relaciones
Si las relaciones muestran códigos largos (documentIds) en lugar del nombre:
1. Ve a **"Content Manager"** ➔ **"Marcas"** (o Modelos).
2. Arriba a la derecha, haz clic en **"Configure the view"**.
3. En el panel derecho, busca la opción **"Main field"** (Campo principal).
4. Cambia `id` por **`nombre`**.
5. Haz clic en **"Save"**.

### 2. Ajustar el diseño del formulario
Si los campos se ven desordenados:
1. En la misma pantalla de **"Configure the view"**, arrastra los campos para organizarlos.
2. Recomendación: Pon el `nombre` y el `slug` en la misma fila para ahorrar espacio.

### 3. Limpiar datos antiguos (Opcional)
Si ves registros que dicen "Untitled" es porque se crearon con el nombre antiguo.
- Borra esos registros y reinicia el servidor; el sistema los creará de nuevo correctamente con el nombre en español.
