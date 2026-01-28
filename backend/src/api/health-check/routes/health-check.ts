export default {
  routes: [
    {
      method: 'GET',
      path: '/health-check',
      handler: 'health-check.check',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
