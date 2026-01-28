/**
 * health-check controller
 */

import { Core } from '@strapi/strapi';

export default {
  async check(ctx) {
    const start = Date.now();
    let dbStatus = 'disconnected';
    
    try {
        // Simple query to verify DB connection
        await strapi.db.query('plugin::users-permissions.user').count();
        dbStatus = 'connected';
    } catch (e) {
        dbStatus = 'disconnected';
        strapi.log.error('Health Check DB Error', e);
    }

    const duration = Date.now() - start;

    ctx.body = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      backend: 'connected',
      database: dbStatus,
      latency: duration
    };
  }
};
