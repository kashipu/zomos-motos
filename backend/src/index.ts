// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const products = [
      {
        name: "Casco Airoh Aviator 3",
        price: 2800000,
        description: "Casco Off-Road de alta gama en fibra de carbono. Máxima ventilación y ligereza.",
        sku: "CAS-ARH-A3",
      },
      {
        name: "Guantes Alpinestars SMX-1 Air V2",
        price: 320000,
        description: "Guantes de calle ligeros con malla técnica y protección de nudillos.",
        sku: "GUA-AST-SMX1",
      },
      {
        name: "Casco de Prueba Zomos",
        price: 1500000,
        description: "Casco de prueba para verificación de integración.",
        sku: "CAS-TEST-01",
      }
    ];

    // Seed products...
    for (const data of products) {
      try {
        const existing = await strapi.documents('api::product.product').findFirst({
          filters: { sku: data.sku }
        });

        if (!existing) {
          await strapi.documents('api::product.product').create({
            data: { ...data, status: 'published' },
            status: 'published'
          });
          console.log(`[Seed] Created product: ${data.name}`);
        }
      } catch (err) {
        console.error(`[Seed] Error creating ${data.name}:`, err.message);
      }
    }

    // Grant public permissions if they don't exist
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });

      if (publicRole) {
        const permissionsToGrant = [
          { action: 'api::product.product.find' },
          { action: 'api::product.product.findOne' },
          { action: 'api::category.category.find' },
          { action: 'api::category.category.findOne' },
        ];

        for (const perm of permissionsToGrant) {
          const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: publicRole.id,
              action: perm.action
            }
          });

          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: publicRole.id,
                action: perm.action
              }
            });
            console.log(`[Seed] Granted Public permission for: ${perm.action}`);
          }
        }
      }
    } catch (err) {
      console.error('[Seed] Error granting permissions:', err.message);
    }
  },
};
