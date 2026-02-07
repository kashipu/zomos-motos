/**
 * Script de Seed para Zomos Motos
 *
 * Uso:
 *   npm run seed
 *
 * Este script carga datos iniciales en todas las colecciones:
 * - marcas
 * - modelos_moto
 * - categorias
 * - productos_moto
 * - productos_piloto
 *
 * Ejecución:
 *   desde la carpeta backend: npm run seed
 */

const fs = require('fs');
const path = require('path');

/**
 * Función principal de seed
 * @param {Object} strapi - Instancia de Strapi
 */
async function seedDatabase(strapi) {
  console.log('\n🌱 Iniciando seed de datos para Zomos Motos...\n');

  try {
    const seedFile = path.join(__dirname, '../seed_products.json');
    const seedData = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
    const { seed } = seedData;

    // 1. Crear Marcas
    console.log('📍 Creando marcas...');
    const marcasMap = {};
    for (const marca of seed.marcas) {
      const existing = await strapi.db.query('api::marca.marca').findOne({
        where: { nombre: marca.nombre },
      });

      if (!existing) {
        const created = await strapi.db.query('api::marca.marca').create({
          data: marca,
        });
        marcasMap[marca.nombre] = created.id;
        console.log(`  ✓ Marca creada: ${marca.nombre}`);
      } else {
        marcasMap[marca.nombre] = existing.id;
        console.log(`  → Marca ya existe: ${marca.nombre}`);
      }
    }

    // 2. Crear Modelos de Moto
    console.log('\n🏍️ Creando modelos de moto...');
    const modelosMap = {};
    for (const modelo of seed.modelos_moto) {
      const existing = await strapi.db.query('api::modelo-moto.modelo-moto').findOne({
        where: { slug: modelo.slug },
      });

      if (!existing) {
        const created = await strapi.db.query('api::modelo-moto.modelo-moto').create({
          data: {
            nombre: modelo.nombre,
            slug: modelo.slug,
            marca: marcasMap[modelo.marca],
          },
        });
        modelosMap[modelo.slug] = created.id;
        console.log(`  ✓ Modelo creado: ${modelo.nombre}`);
      } else {
        modelosMap[modelo.slug] = existing.id;
        console.log(`  → Modelo ya existe: ${modelo.nombre}`);
      }
    }

    // 3. Crear Categorías
    console.log('\n📂 Creando categorías...');
    const categoriasMap = {};
    for (const categoria of seed.categorias) {
      const existing = await strapi.db.query('api::categoria.categoria').findOne({
        where: { slug: categoria.slug },
      });

      if (!existing) {
        const created = await strapi.db.query('api::categoria.categoria').create({
          data: categoria,
        });
        categoriasMap[categoria.nombre] = created.id;
        console.log(`  ✓ Categoría creada: ${categoria.nombre}`);
      } else {
        categoriasMap[categoria.nombre] = existing.id;
        console.log(`  → Categoría ya existe: ${categoria.nombre}`);
      }
    }

    // 4. Crear Productos de Moto
    console.log('\n🔧 Creando productos de moto...');
    for (const producto of seed.productos_moto) {
      const existing = await strapi.db.query('api::producto-moto.producto-moto').findOne({
        where: { slug: producto.slug },
      });

      if (!existing) {
        await strapi.db.query('api::producto-moto.producto-moto').create({
          data: {
            nombre: producto.nombre,
            slug: producto.slug,
            precio: producto.precio,
            referencia: producto.referencia,
            descripcion: producto.descripcion,
            categoria: categoriasMap[producto.categoria],
            marca_moto: marcasMap[producto.marca_moto],
            modelo_moto: modelosMap[producto.modelo_moto],
            metadatos_seo: producto.metadatos_seo,
          },
        });
        console.log(`  ✓ Producto moto creado: ${producto.nombre}`);
      } else {
        console.log(`  → Producto moto ya existe: ${producto.nombre}`);
      }
    }

    // 5. Crear Productos de Piloto
    console.log('\n👨‍🏫 Creando productos de piloto...');
    for (const producto of seed.productos_piloto) {
      const existing = await strapi.db.query('api::producto-piloto.producto-piloto').findOne({
        where: { slug: producto.slug },
      });

      if (!existing) {
        await strapi.db.query('api::producto-piloto.producto-piloto').create({
          data: {
            nombre: producto.nombre,
            slug: producto.slug,
            precio: producto.precio,
            referencia: producto.referencia,
            descripcion: producto.descripcion,
            categoria: categoriasMap[producto.categoria],
            marca_generico: producto.marca_generico,
            variantes_piloto: producto.variantes_piloto,
            metadatos_seo: producto.metadatos_seo,
          },
        });
        console.log(`  ✓ Producto piloto creado: ${producto.nombre}`);
      } else {
        console.log(`  → Producto piloto ya existe: ${producto.nombre}`);
      }
    }

    console.log('\n✅ Seed completado exitosamente!\n');
  } catch (error) {
    console.error('\n❌ Error durante seed:', error);
    throw error;
  }
}

module.exports = seedDatabase;
