/**
 * Script de Seed para Zomos Motos
 *
 * Uso:
 *   npm run seed
 *
 * Carga datos iniciales en todas las colecciones:
 * - marcas_moto (fabricantes de motos)
 * - marcas (equipamiento: cascos, ropa, accesorios)
 * - modelos_moto (con anio_desde/anio_hasta)
 * - categorias (MOTO, PILOTO, UNIVERSAL)
 * - productos_moto (con compatibilidades componente repetible)
 * - productos_piloto (con variantes_piloto componente repetible)
 */

const fs = require('fs');
const path = require('path');

async function seedDatabase(strapi) {
  console.log('\n🌱 Iniciando seed de datos para Zomos Motos...\n');

  try {
    const seedFile = path.join(__dirname, '../seed_products.json');
    const seedData = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
    const { seed } = seedData;

    // 1. Crear Marcas de Moto (fabricantes)
    console.log('🏭 Creando marcas de moto...');
    const marcasMotoMap = {};
    for (const marca of seed.marcas_moto) {
      const existing = await strapi.db.query('api::marca-moto.marca-moto').findOne({
        where: { nombre: marca.nombre },
      });

      if (!existing) {
        const created = await strapi.db.query('api::marca-moto.marca-moto').create({
          data: marca,
        });
        marcasMotoMap[marca.nombre] = created.id;
        console.log(`  ✓ Marca moto creada: ${marca.nombre}`);
      } else {
        marcasMotoMap[marca.nombre] = existing.id;
        console.log(`  → Marca moto ya existe: ${marca.nombre}`);
      }
    }

    // 2. Crear Marcas de Equipamiento
    console.log('\n🏷️ Creando marcas de equipamiento...');
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

    // 3. Crear Modelos de Moto
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
            marca: marcasMotoMap[modelo.marca_moto],
            anio_desde: modelo.anio_desde || null,
            anio_hasta: modelo.anio_hasta || null,
          },
        });
        modelosMap[modelo.nombre] = created.id;
        console.log(`  ✓ Modelo creado: ${modelo.nombre}`);
      } else {
        modelosMap[modelo.nombre] = existing.id;
        console.log(`  → Modelo ya existe: ${modelo.nombre}`);
      }
    }

    // 4. Crear Categorías
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

    // 5. Crear Productos de Moto (con compatibilidades como componente repetible)
    console.log('\n🔧 Creando productos de moto...');
    for (const producto of seed.productos_moto) {
      const existing = await strapi.db.query('api::producto-moto.producto-moto').findOne({
        where: { slug: producto.slug },
      });

      if (!existing) {
        const compatibilidades = (producto.compatibilidades || []).map((comp) => ({
          marca_moto: marcasMotoMap[comp.marca_moto] || null,
          modelo_moto: modelosMap[comp.modelo_moto] || null,
        }));

        await strapi.db.query('api::producto-moto.producto-moto').create({
          data: {
            nombre: producto.nombre,
            slug: producto.slug,
            referencia: producto.referencia,
            precio: producto.precio,
            descripcion: producto.descripcion,
            categoria: categoriasMap[producto.categoria],
            marca: marcasMap[producto.marca] || null,
            compatibilidades,
            metadatos_seo: producto.metadatos_seo,
          },
        });
        console.log(`  ✓ Producto moto creado: ${producto.nombre}`);
      } else {
        console.log(`  → Producto moto ya existe: ${producto.nombre}`);
      }
    }

    // 6. Crear Productos de Piloto (con variantes_piloto como componente repetible)
    console.log('\n🧑‍✈️ Creando productos de piloto...');
    for (const producto of seed.productos_piloto) {
      const existing = await strapi.db.query('api::producto-piloto.producto-piloto').findOne({
        where: { slug: producto.slug },
      });

      if (!existing) {
        await strapi.db.query('api::producto-piloto.producto-piloto').create({
          data: {
            nombre: producto.nombre,
            slug: producto.slug,
            referencia: producto.referencia,
            precio: producto.precio,
            descripcion: producto.descripcion,
            categoria: categoriasMap[producto.categoria],
            marca: marcasMap[producto.marca] || null,
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
