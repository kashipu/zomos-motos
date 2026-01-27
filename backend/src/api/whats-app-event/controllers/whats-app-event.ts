import { factories } from "@strapi/strapi"

export default factories.createCoreController(
  "api::whats-app-event.whats-app-event",
  ({ strapi }) => ({
    async intent(ctx) {
      const { cart, utms } = ctx.request.body;

      // Generate a unique tracking ID (readable short code)
      const trackingId = `ZM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // Save the intent event
      await strapi.documents("api::whats-app-event.whats-app-event").create({
        data: {
          type: "INTENT",
          tracking_id: trackingId,
          payload: { cart, utms },
          status: 'published',
        },
      });

      return {
        redirect_url: `${process.env.PUBLIC_STRAPI_URL || 'http://localhost:1338'}/api/wa/${trackingId}`,
        tracking_id: trackingId,
      };
    },

    async open(ctx) {
      const { tracking_id } = ctx.params;

      // Find the original intent event
      const intentEvent = await strapi.documents("api::whats-app-event.whats-app-event").findFirst({
        filters: { tracking_id, type: "INTENT" },
      });

      if (!intentEvent) {
        return ctx.notFound("Tracking ID not found");
      }

      // Record the open event
      await strapi.documents("api::whats-app-event.whats-app-event").create({
        data: {
          type: "OPEN",
          tracking_id: tracking_id,
          payload: intentEvent.payload,
          status: 'published',
        },
      });

      // Construct WhatsApp link
      const phone = process.env.WHATSAPP_NUMBER || "573000000000";
      const cartItems = (intentEvent.payload as any).cart || [];
      const total = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
      const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

      let itemsText = cartItems.map((item: any) => 
        `- *${item.name}*\n${item.sku ? `  SKU: ${item.sku}\n` : ''}  Cant: ${item.quantity}\n  Precio: ${formatter.format(item.price)}\n  Subtotal: ${formatter.format(item.price * item.quantity)}`
      ).join('\n\n');

      const message = `\u2705 *¡Nueva Orden de Zomos Motos!*\n_Referencia: ${tracking_id}_\n\n\uD83D\uDED2 *Resumen del Pedido:*\n${itemsText}\n\n━━━━━━━━━━━━━━━━━━━━\n\uD83D\uDCB0 *TOTAL A PAGAR: ${formatter.format(total)}*\n━━━━━━━━━━━━━━━━━━━━\n\n¡Hola Zomos Motos! Me interesa concretar mi compra de estos productos. ¿Me pueden ayudar con el pago?`;

      const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      ctx.redirect(waLink);
    },
  })
);
