export default ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "smtp.gmail.com"),
        port: env.int("SMTP_PORT", 587),
        secure: env.bool("SMTP_SECURE", false),
        auth: {
          user: env("SMTP_USER"),
          pass: env("SMTP_PASS"),
        },
      },
      settings: {
        defaultFrom: env("EMAIL_FROM", "no-reply@zomosmotos.com"),
        defaultReplyTo: env("EMAIL_REPLY_TO", "no-reply@zomosmotos.com"),
      },
    },
  },
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
