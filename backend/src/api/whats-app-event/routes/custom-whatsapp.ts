export default {
  routes: [
    {
      method: "POST",
      path: "/checkout/whatsapp",
      handler: "whats-app-event.intent",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/wa/:tracking_id",
      handler: "whats-app-event.open",
      config: {
        auth: false,
      },
    },
  ],
};
