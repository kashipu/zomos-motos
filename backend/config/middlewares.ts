export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://zomosmotos.com', 'http://localhost:4321'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '5mb',
      jsonLimit: '5mb',
      textLimit: '5mb',
      formidable: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
