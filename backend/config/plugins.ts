export default ({ env }) => ({
  upload: {
    config: {
      // Tamaño máximo de archivo: 5MB
      sizeLimit: env.int("UPLOAD_MAX_SIZE", 5 * 1024 * 1024),
      // Breakpoints automáticos para imágenes responsivas
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
      },
    },
  },
});
