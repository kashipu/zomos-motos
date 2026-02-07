/**
 * Seed Simple para Zomos Motos
 *
 * Este script se puede ejecutar en la consola de Strapi (strapi console)
 * Copia y pega el contenido en la consola interactiva de Strapi
 *
 * Uso:
 *   strapi console
 *   // Copia y pega este contenido o ejecuta:
 *   // await strapi.service('api::seed.seed').seed();
 */

// Ejecutar manualmente en strapi console
// Opción 1: Copia y pega esto directamente:

(async () => {
  console.log('\n🌱 Iniciando seed de datos para Zomos Motos...\n');

  try {
    // 1. CREAR MARCAS
    console.log('📍 Creando marcas...');

    const yamaha = await strapi.db.query('api::marca.marca').findOne({
      where: { nombre: 'Yamaha' }
    });
    const yamahaId = yamaha?.id || (await strapi.db.query('api::marca.marca').create({
      data: { nombre: 'Yamaha', slug: 'yamaha' }
    })).id;
    console.log('  ✓ Yamaha');

    const honda = await strapi.db.query('api::marca.marca').findOne({
      where: { nombre: 'Honda' }
    });
    const hondaId = honda?.id || (await strapi.db.query('api::marca.marca').create({
      data: { nombre: 'Honda', slug: 'honda' }
    })).id;
    console.log('  ✓ Honda');

    // 2. CREAR MODELOS
    console.log('\n🏍️ Creando modelos de moto...');

    const mt09 = await strapi.db.query('api::modelo-moto.modelo-moto').findOne({
      where: { slug: 'mt-09' }
    });
    const mt09Id = mt09?.id || (await strapi.db.query('api::modelo-moto.modelo-moto').create({
      data: { nombre: 'MT-09', slug: 'mt-09', marca: yamahaId }
    })).id;
    console.log('  ✓ MT-09');

    const cb500f = await strapi.db.query('api::modelo-moto.modelo-moto').findOne({
      where: { slug: 'cb500f' }
    });
    const cb500fId = cb500f?.id || (await strapi.db.query('api::modelo-moto.modelo-moto').create({
      data: { nombre: 'CB500F', slug: 'cb500f', marca: hondaId }
    })).id;
    console.log('  ✓ CB500F');

    // 3. CREAR CATEGORÍAS
    console.log('\n📂 Creando categorías...');

    const repuestos = await strapi.db.query('api::categoria.categoria').findOne({
      where: { slug: 'repuestos' }
    });
    const repuestosId = repuestos?.id || (await strapi.db.query('api::categoria.categoria').create({
      data: {
        nombre: 'Repuestos',
        slug: 'repuestos',
        tipo: 'MOTO',
        descripcion: 'Repuestos originales y de calidad para motocicletas'
      }
    })).id;
    console.log('  ✓ Repuestos');

    const cascos = await strapi.db.query('api::categoria.categoria').findOne({
      where: { slug: 'cascos' }
    });
    const cascosId = cascos?.id || (await strapi.db.query('api::categoria.categoria').create({
      data: {
        nombre: 'Cascos',
        slug: 'cascos',
        tipo: 'PILOTO',
        descripcion: 'Cascos integrales y modulares de protección premium'
      }
    })).id;
    console.log('  ✓ Cascos');

    // 4. CREAR PRODUCTOS MOTO
    console.log('\n🔧 Creando productos de moto...');

    const leva = await strapi.db.query('api::producto-moto.producto-moto').findOne({
      where: { slug: 'leva-lujo-yamaha-mt09' }
    });
    if (!leva) {
      await strapi.db.query('api::producto-moto.producto-moto').create({
        data: {
          nombre: 'Leva de Lujo Yamaha MT-09',
          slug: 'leva-lujo-yamaha-mt09',
          precio: 45.99,
          referencia: 'LEVA-YAM-MT09-001',
          descripcion: '<p>Leva de alta calidad para Yamaha MT-09. Fabricada con materiales premium garantizando durabilidad y rendimiento óptimo.</p>',
          categoria: repuestosId,
          marca_moto: yamahaId,
          modelo_moto: mt09Id,
          metadatos_seo: {
            titulo_meta: 'Leva de Lujo para Yamaha MT-09 | Zomos Motos',
            descripcion_meta: 'Leva premium para Yamaha MT-09. Durabilidad garantizada y máximo rendimiento. Envío rápido en Colombia.'
          }
        }
      });
      console.log('  ✓ Leva de Lujo Yamaha MT-09');
    } else {
      console.log('  → Leva de Lujo Yamaha MT-09 (ya existe)');
    }

    const filtro = await strapi.db.query('api::producto-moto.producto-moto').findOne({
      where: { slug: 'filtro-aire-honda-cb500f' }
    });
    if (!filtro) {
      await strapi.db.query('api::producto-moto.producto-moto').create({
        data: {
          nombre: 'Filtro de Aire Premium Honda CB500F',
          slug: 'filtro-aire-honda-cb500f',
          precio: 32.50,
          referencia: 'FILTRO-HON-CB500-001',
          descripcion: '<p>Filtro de aire de alto flujo para Honda CB500F. Aumenta la eficiencia del motor y mejora la respuesta del acelerador.</p>',
          categoria: repuestosId,
          marca_moto: hondaId,
          modelo_moto: cb500fId,
          metadatos_seo: {
            titulo_meta: 'Filtro de Aire Premium Honda CB500F | Zomos Motos',
            descripcion_meta: 'Filtro de aire de alto flujo para Honda CB500F. Mejor eficiencia y respuesta del motor. Envío garantizado.'
          }
        }
      });
      console.log('  ✓ Filtro de Aire Premium Honda CB500F');
    } else {
      console.log('  → Filtro de Aire Premium Honda CB500F (ya existe)');
    }

    // 5. CREAR PRODUCTOS PILOTO
    console.log('\n👨‍🏫 Creando productos de piloto...');

    const casco = await strapi.db.query('api::producto-piloto.producto-piloto').findOne({
      where: { slug: 'casco-bell-moto-9' }
    });
    if (!casco) {
      await strapi.db.query('api::producto-piloto.producto-piloto').create({
        data: {
          nombre: 'Casco Integral Bell Moto-9',
          slug: 'casco-bell-moto-9',
          precio: 350.00,
          referencia: 'CASCO-BELL-MOTO9-001',
          descripcion: '<p>Casco integral Bell Moto-9 con certificación DOT y ECE. Diseño aerodinámico con excelente ventilación y comodidad para largas jornadas.</p>',
          categoria: cascosId,
          marca_generico: false,
          variantes_piloto: [
            {
              talla: 'M',
              color: 'Negro',
              marca_piloto: 'BELL',
              modificador_precio: 0,
              cantidad_stock: 12
            },
            {
              talla: 'L',
              color: 'Rojo',
              marca_piloto: 'BELL',
              modificador_precio: 5.00,
              cantidad_stock: 8
            },
            {
              talla: 'XL',
              color: 'Blanco',
              marca_piloto: 'BELL',
              modificador_precio: 5.00,
              cantidad_stock: 5
            }
          ],
          metadatos_seo: {
            titulo_meta: 'Casco Bell Moto-9 - Protección Premium | Zomos Motos',
            descripcion_meta: 'Casco integral Bell Moto-9 con certificación DOT/ECE. Máxima protección y comodidad para pilotos exigentes.'
          }
        }
      });
      console.log('  ✓ Casco Integral Bell Moto-9');
    } else {
      console.log('  → Casco Integral Bell Moto-9 (ya existe)');
    }

    const chaqueta = await strapi.db.query('api::producto-piloto.producto-piloto').findOne({
      where: { slug: 'chaqueta-alpinestars-gp-pro' }
    });
    if (!chaqueta) {
      await strapi.db.query('api::producto-piloto.producto-piloto').create({
        data: {
          nombre: 'Chaqueta de Moto Alpinestars GP Pro',
          slug: 'chaqueta-alpinestars-gp-pro',
          precio: 450.00,
          referencia: 'CHAQ-ALPI-GPPRO-001',
          descripcion: '<p>Chaqueta de cuero premium Alpinestars GP Pro. Protección máxima con tecnología de absorción de impactos y ventilación estratégica.</p>',
          categoria: cascosId,
          marca_generico: false,
          variantes_piloto: [
            {
              talla: 'S',
              color: 'Negro',
              marca_piloto: 'ALPINESTARS',
              modificador_precio: 0,
              cantidad_stock: 6
            },
            {
              talla: 'M',
              color: 'Negro',
              marca_piloto: 'ALPINESTARS',
              modificador_precio: 0,
              cantidad_stock: 10
            },
            {
              talla: 'L',
              color: 'Rojo/Negro',
              marca_piloto: 'ALPINESTARS',
              modificador_precio: 15.00,
              cantidad_stock: 3
            }
          ],
          metadatos_seo: {
            titulo_meta: 'Chaqueta Alpinestars GP Pro - Cuero Premium | Zomos Motos',
            descripcion_meta: 'Chaqueta de cuero Alpinestars GP Pro. Máxima protección y comodidad para pilotos profesionales y aficionados.'
          }
        }
      });
      console.log('  ✓ Chaqueta de Moto Alpinestars GP Pro');
    } else {
      console.log('  → Chaqueta de Moto Alpinestars GP Pro (ya existe)');
    }

    console.log('\n✅ Seed completado exitosamente!\n');

  } catch (error) {
    console.error('\n❌ Error durante seed:', error);
    throw error;
  }
})();
