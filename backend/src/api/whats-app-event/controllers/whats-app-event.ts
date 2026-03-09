import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::whats-app-event.whats-app-event",
  ({ strapi }) => ({
    async intent(ctx) {
      const { cart, customer, utms } = ctx.request.body;

      const trackingId = `ZM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // Calcular monto total
      const montoTotal = (cart || []).reduce((acc: number, item: any) => {
        const precio = item.precio ?? 0;
        return acc + precio * (item.cantidad ?? 1);
      }, 0);

      // Extraer marcas de moto del pedido (metadata)
      const marcasMotoMeta: string[] = Array.from(
        new Set(
          (cart || [])
            .filter((item: any) => item.compatibilidad)
            .map((item: any) => {
              const match = (item.compatibilidad as string).match(/^(\w+)/);
              return match ? match[1] : null;
            })
            .filter((v: any): v is string => !!v)
        )
      );

      // Crear pedido en Strapi
      await strapi.documents("api::pedido.pedido").create({
        data: {
          tracking_id: trackingId,
          estado: "PENDIENTE",
          cliente_nombre: customer?.nombre || "",
          cliente_telefono: customer?.telefono || "",
          cliente_correo: customer?.correo || "",
          cliente_cedula: customer?.cedula || "",
          cliente_direccion: customer?.direccion || "",
          autorizacion_datos: customer?.autorizacion || false,
          items: cart || [],
          monto_total: montoTotal,
          marcas_moto_meta: marcasMotoMeta,
          fecha_pedido: new Date().toISOString(),
          whatsapp_enviado: false,
        },
      });

      // Resumen legible para admin
      const resumenItems = (cart || [])
        .map((item: any) => `${item.cantidad}x ${item.nombre}`)
        .join(", ");
      const cantidadItems = (cart || []).reduce((acc: number, item: any) => acc + (item.cantidad ?? 1), 0);

      // Crear evento de tracking INTENT
      await strapi.documents("api::whats-app-event.whats-app-event").create({
        data: {
          type: "INTENT",
          tracking_id: trackingId,
          cliente_nombre: customer?.nombre || "",
          cliente_telefono: customer?.telefono || "",
          monto_total: montoTotal,
          resumen_items: resumenItems,
          cantidad_items: cantidadItems,
          payload: { cart, customer, utms },
        },
      });

      return {
        redirect_url: `${process.env.PUBLIC_STRAPI_URL || "http://localhost:1338"}/api/wa/${trackingId}`,
        tracking_id: trackingId,
      };
    },

    async open(ctx) {
      const { tracking_id } = ctx.params;

      const intentEvent = await strapi
        .documents("api::whats-app-event.whats-app-event")
        .findFirst({ filters: { tracking_id, type: "INTENT" } });

      if (!intentEvent) {
        return ctx.notFound("Tracking ID not found");
      }

      // Marcar pedido como enviado a WhatsApp
      const pedido = await strapi
        .documents("api::pedido.pedido")
        .findFirst({ filters: { tracking_id } });

      if (pedido) {
        await strapi.documents("api::pedido.pedido").update({
          documentId: pedido.documentId,
          data: {
            whatsapp_enviado: true,
            fecha_whatsapp: new Date().toISOString(),
          },
        });
      }

      // Crear evento OPEN con campos legibles del INTENT
      await strapi.documents("api::whats-app-event.whats-app-event").create({
        data: {
          type: "OPEN",
          tracking_id,
          cliente_nombre: (intentEvent as any).cliente_nombre || "",
          cliente_telefono: (intentEvent as any).cliente_telefono || "",
          monto_total: (intentEvent as any).monto_total || 0,
          resumen_items: (intentEvent as any).resumen_items || "",
          cantidad_items: (intentEvent as any).cantidad_items || 0,
          payload: intentEvent.payload,
        },
      });

      const phone = process.env.WHATSAPP_NUMBER || "573000000000";
      const payload = intentEvent.payload as any;
      const items = payload.cart || [];
      const customer = payload.customer || {};
      const fmt = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      });

      const now = new Date();
      const fecha = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      const itemsText = items
        .map((item: any) => {
          const precio = item.precio ?? 0;
          const subtotal = precio * (item.cantidad ?? 1);

          let detail = `- *${item.nombre}*`;
          if (item.sku) detail += `\n  SKU: ${item.sku}`;

          if (item.variante) {
            const v = item.variante;
            const parts: string[] = [];
            if (v.talla) parts.push(`Talla: ${v.talla}`);
            if (v.color) parts.push(`Color: ${v.color}`);
            if (parts.length) detail += `\n  ${parts.join(" | ")}`;
          }

          if (item.compatibilidad) {
            detail += `\n  Compatible: ${(item.compatibilidad as string).split(", ")[0]}`;
          }

          detail += `\n  Cant: ${item.cantidad}`;
          detail += `\n  Precio: ${fmt.format(precio)}`;
          detail += `\n  Subtotal: ${fmt.format(subtotal)}`;

          return detail;
        })
        .join("\n\n");

      const total = items.reduce((acc: number, item: any) => {
        return acc + (item.precio ?? 0) * (item.cantidad ?? 1);
      }, 0);

      // Datos del cliente
      let customerText = "";
      if (customer.nombre) {
        customerText =
          `\uD83D\uDC64 *Datos del Cliente:*\n` +
          `Nombre: ${customer.nombre}\n` +
          `Tel\u00e9fono: ${customer.telefono || "N/A"}\n` +
          `Correo: ${customer.correo || "N/A"}\n` +
          `C\u00e9dula: ${customer.cedula || "N/A"}\n` +
          `Direcci\u00f3n: ${customer.direccion || "N/A"}\n\n`;
      }

      const message =
        `\u2705 *\u00a1Nueva Orden de Zomos Motos!*\n` +
        `_Referencia: ${tracking_id}_\n` +
        `_Fecha: ${fecha}_\n\n` +
        customerText +
        `\uD83D\uDED2 *Resumen del Pedido:*\n${itemsText}\n\n` +
        `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n` +
        `\uD83D\uDCB0 *TOTAL: ${fmt.format(total)}*\n` +
        `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\n` +
        `\u00a1Hola Zomos Motos! Me interesa concretar mi compra. \u00bfMe pueden ayudar con el pago?`;

      const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      ctx.redirect(waLink);
    },
  })
);
