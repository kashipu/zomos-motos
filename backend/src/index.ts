export default {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    console.log("[Seed] Iniciando seed de datos...");

    // ═══════════════════════════════════════════════════════════════
    // Helper genérico para upsert
    // ═══════════════════════════════════════════════════════════════
    async function upsert(uid: string, filterField: string, data: any): Promise<string> {
      let doc = await strapi.documents(uid).findFirst({ filters: { [filterField]: data[filterField] } });
      if (!doc) {
        doc = await strapi.documents(uid).create({ data, status: "published" });
        console.log(`[Seed] ${uid.split(".").pop()}: ${data.nombre || data[filterField]}`);
      }
      return doc.documentId;
    }

    // ═══════════════════════════════════════════════════════════════
    // 1. CATEGORÍAS
    // ═══════════════════════════════════════════════════════════════
    const categorias = [
      // ── PILOTO (equipamiento personal del motociclista) ──
      { nombre: "Cascos", slug: "cascos", tipo: "PILOTO", descripcion: "Cascos integrales, abatibles y jet certificados" },
      { nombre: "Guantes", slug: "guantes", tipo: "PILOTO", descripcion: "Guantes cortos, largos e impermeables" },
      { nombre: "Chaquetas", slug: "chaquetas", tipo: "PILOTO", descripcion: "Chaquetas con protecciones, cortavientos y touring" },
      { nombre: "Pantalones", slug: "pantalones", tipo: "PILOTO", descripcion: "Pantalones con protecciones y jean moto" },
      { nombre: "Botas", slug: "botas", tipo: "PILOTO", descripcion: "Botas, zapatillas y calzado técnico" },
      { nombre: "Impermeables", slug: "impermeables", tipo: "PILOTO", descripcion: "Trajes, ponchos y conjuntos impermeables" },
      { nombre: "Protección Corporal", slug: "proteccion-corporal", tipo: "PILOTO", descripcion: "Rodilleras, coderas, petos y espalderas" },
      { nombre: "Accesorios Piloto", slug: "accesorios-piloto", tipo: "PILOTO", descripcion: "Intercomunicadores, morrales, visores y buff" },
      // ── MOTO (partes, repuestos y accesorios para la motocicleta) ──
      { nombre: "Iluminación", slug: "iluminacion", tipo: "MOTO", descripcion: "Farolas LED, exploradoras, direccionales y stops" },
      { nombre: "Maniguetas y Mandos", slug: "maniguetas-mandos", tipo: "MOTO", descripcion: "Maniguetas, manillar, puños y espejos" },
      { nombre: "Protección Moto", slug: "proteccion-moto", tipo: "MOTO", descripcion: "Sliders, defensas, crashbars y protectores" },
      { nombre: "Frenos", slug: "frenos", tipo: "MOTO", descripcion: "Pastillas, discos, latiguillos y bombas" },
      { nombre: "Llantas y Neumáticos", slug: "llantas", tipo: "MOTO", descripcion: "Llantas, neumáticos y cámaras" },
      { nombre: "Escapes", slug: "escapes", tipo: "MOTO", descripcion: "Escapes deportivos, headers y silenciadores" },
      { nombre: "Eléctrico", slug: "electrico", tipo: "MOTO", descripcion: "Alarmas, cargadores USB, voltímetros y relés" },
      { nombre: "Accesorios Moto", slug: "accesorios-moto", tipo: "MOTO", descripcion: "Parrillas, baúles, portaequipaje y guardabarros" },
      // ── UNIVERSAL (aplica a moto y piloto) ──
      { nombre: "Lubricantes y Limpieza", slug: "lubricantes-limpieza", tipo: "UNIVERSAL", descripcion: "Productos de mantenimiento, lubricantes y limpieza" },
      { nombre: "Herramientas", slug: "herramientas", tipo: "UNIVERSAL", descripcion: "Herramientas, kits de reparación y accesorios de taller" },
    ];

    const catDocs: Record<string, string> = {};
    for (const c of categorias) {
      try {
        catDocs[c.slug] = await upsert("api::categoria.categoria", "slug", c);
      } catch (err: any) {
        console.error(`[Seed] Error Categoría ${c.nombre}:`, err.message);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // 2a. MARCAS DE MOTO (fabricantes — top ventas Colombia 2025)
    //     Ranking: Bajaj > AKT > Yamaha > Suzuki > Honda > TVS > Hero
    // ═══════════════════════════════════════════════════════════════
    const marcasMoto = [
      { nombre: "Bajaj", slug: "bajaj" },
      { nombre: "AKT", slug: "akt" },
      { nombre: "Yamaha", slug: "yamaha" },
      { nombre: "Suzuki", slug: "suzuki" },
      { nombre: "Honda", slug: "honda" },
      { nombre: "TVS", slug: "tvs" },
      { nombre: "Hero", slug: "hero" },
      { nombre: "Victory", slug: "victory" },
      { nombre: "KTM", slug: "ktm" },
      { nombre: "Kawasaki", slug: "kawasaki" },
      { nombre: "Kymco", slug: "kymco" },
      { nombre: "Royal Enfield", slug: "royal-enfield" },
      { nombre: "BMW Motorrad", slug: "bmw-motorrad" },
      { nombre: "VOGE", slug: "voge" },
      { nombre: "Benelli", slug: "benelli" },
    ];

    const marcaMotoDocs: Record<string, string> = {};
    for (const m of marcasMoto) {
      try {
        marcaMotoDocs[m.slug] = await upsert("api::marca-moto.marca-moto", "slug", m);
      } catch (err: any) {
        console.error(`[Seed] Error Marca Moto ${m.nombre}:`, err.message);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // 2b. MARCAS DE EQUIPAMIENTO (cascos, ropa, partes aftermarket)
    //     Incluye marcas colombianas y populares del mercado local
    // ═══════════════════════════════════════════════════════════════
    const marcas = [
      // Cascos — económicos y gama media (mercado colombiano)
      { nombre: "ICH", slug: "ich" },
      { nombre: "Shaft", slug: "shaft" },
      { nombre: "MT Helmets", slug: "mt-helmets" },
      { nombre: "LS2", slug: "ls2" },
      { nombre: "Shiro", slug: "shiro" },
      { nombre: "HJC", slug: "hjc" },
      { nombre: "AGV", slug: "agv" },
      { nombre: "Nolan", slug: "nolan" },
      // Ropa y protección — colombianas y accesibles
      { nombre: "Pigmalion", slug: "pigmalion" },
      { nombre: "Shaft Gear", slug: "shaft-gear" },
      { nombre: "Alpinestars", slug: "alpinestars" },
      { nombre: "LS2 Gear", slug: "ls2-gear" },
      { nombre: "Icon", slug: "icon" },
      // Comunicación
      { nombre: "Sena", slug: "sena" },
      { nombre: "Cardo", slug: "cardo" },
      // Partes aftermarket — populares en Colombia
      { nombre: "Fire Parts", slug: "fire-parts" },
      { nombre: "Rinometal", slug: "rinometal" },
      { nombre: "Givi", slug: "givi" },
      { nombre: "Shad", slug: "shad" },
      { nombre: "Pirelli", slug: "pirelli" },
      { nombre: "Michelin", slug: "michelin" },
      { nombre: "IRC", slug: "irc" },
      { nombre: "Genérica", slug: "generica" },
    ];

    const marcaDocs: Record<string, string> = {};
    for (const m of marcas) {
      try {
        marcaDocs[m.slug] = await upsert("api::marca.marca", "slug", m);
      } catch (err: any) {
        console.error(`[Seed] Error Marca ${m.nombre}:`, err.message);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // 3. MODELOS DE MOTO (más vendidos Colombia 2025)
    //    Enfoque: gama baja (100-125cc) y media (150-250cc)
    // ═══════════════════════════════════════════════════════════════
    const modelos = [
      // ── Bajaj (#1 Colombia 2025: 185,722 unidades) ──
      { nombre: "Boxer CT 100", slug: "boxer-ct-100", marca: marcaMotoDocs["bajaj"], anio_desde: 2015, anio_hasta: 2026 },
      { nombre: "CT 125", slug: "ct-125", marca: marcaMotoDocs["bajaj"], anio_desde: 2022, anio_hasta: 2026 },
      { nombre: "Discover 125", slug: "discover-125", marca: marcaMotoDocs["bajaj"], anio_desde: 2015, anio_hasta: 2026 },
      { nombre: "Pulsar N160", slug: "pulsar-n160", marca: marcaMotoDocs["bajaj"], anio_desde: 2023, anio_hasta: 2026 },
      { nombre: "Pulsar NS 200", slug: "pulsar-ns-200", marca: marcaMotoDocs["bajaj"], anio_desde: 2017, anio_hasta: 2026 },
      { nombre: "Pulsar RS 200", slug: "pulsar-rs-200", marca: marcaMotoDocs["bajaj"], anio_desde: 2017, anio_hasta: 2026 },
      { nombre: "Pulsar N250", slug: "pulsar-n250", marca: marcaMotoDocs["bajaj"], anio_desde: 2022, anio_hasta: 2026 },
      { nombre: "Dominar 250", slug: "dominar-250", marca: marcaMotoDocs["bajaj"], anio_desde: 2021, anio_hasta: 2026 },
      { nombre: "Dominar 400", slug: "dominar-400", marca: marcaMotoDocs["bajaj"], anio_desde: 2018, anio_hasta: 2026 },
      { nombre: "Pulsar NS 400Z", slug: "pulsar-ns-400z", marca: marcaMotoDocs["bajaj"], anio_desde: 2024, anio_hasta: 2026 },
      // ── AKT (#2 Colombia 2025: 177,769 unidades) ──
      { nombre: "NKD 125", slug: "nkd-125", marca: marcaMotoDocs["akt"], anio_desde: 2018, anio_hasta: 2026 },
      { nombre: "AK 125 Flex", slug: "ak-125-flex", marca: marcaMotoDocs["akt"], anio_desde: 2020, anio_hasta: 2026 },
      { nombre: "AK 125 SL", slug: "ak-125-sl", marca: marcaMotoDocs["akt"], anio_desde: 2020, anio_hasta: 2026 },
      { nombre: "CR4 125", slug: "cr4-125", marca: marcaMotoDocs["akt"], anio_desde: 2020, anio_hasta: 2026 },
      { nombre: "CR5 200", slug: "cr5-200", marca: marcaMotoDocs["akt"], anio_desde: 2021, anio_hasta: 2026 },
      { nombre: "TT 125", slug: "tt-125-akt", marca: marcaMotoDocs["akt"], anio_desde: 2019, anio_hasta: 2026 },
      // ── Yamaha (#3 Colombia 2025: 167,405 unidades) ──
      { nombre: "Crypton FI", slug: "crypton-fi", marca: marcaMotoDocs["yamaha"], anio_desde: 2020, anio_hasta: 2026 },
      { nombre: "T115 FI", slug: "t115-fi", marca: marcaMotoDocs["yamaha"], anio_desde: 2021, anio_hasta: 2026 },
      { nombre: "XTZ 125", slug: "xtz-125", marca: marcaMotoDocs["yamaha"], anio_desde: 2018, anio_hasta: 2026 },
      { nombre: "BWS FI 125", slug: "bws-fi-125", marca: marcaMotoDocs["yamaha"], anio_desde: 2021, anio_hasta: 2026 },
      { nombre: "FZ-S FI 150", slug: "fz-s-fi-150", marca: marcaMotoDocs["yamaha"], anio_desde: 2019, anio_hasta: 2026 },
      { nombre: "Nmax 155", slug: "nmax-155", marca: marcaMotoDocs["yamaha"], anio_desde: 2020, anio_hasta: 2026 },
      { nombre: "FZ 250", slug: "fz-250", marca: marcaMotoDocs["yamaha"], anio_desde: 2019, anio_hasta: 2026 },
      { nombre: "YZF-R3", slug: "yzf-r3", marca: marcaMotoDocs["yamaha"], anio_desde: 2019, anio_hasta: 2026 },
      { nombre: "MT-03", slug: "mt-03", marca: marcaMotoDocs["yamaha"], anio_desde: 2020, anio_hasta: 2026 },
      // ── Suzuki (#4 Colombia 2025: ~167,356 unidades) ──
      { nombre: "GN 125", slug: "gn-125", marca: marcaMotoDocs["suzuki"], anio_desde: 2015, anio_hasta: 2026 },
      { nombre: "Viva R Style 115", slug: "viva-r-style-115", marca: marcaMotoDocs["suzuki"], anio_desde: 2020, anio_hasta: 2026 },
      { nombre: "Address 110", slug: "address-110", marca: marcaMotoDocs["suzuki"], anio_desde: 2019, anio_hasta: 2026 },
      { nombre: "DR 150", slug: "dr-150", marca: marcaMotoDocs["suzuki"], anio_desde: 2020, anio_hasta: 2026 },
      { nombre: "Gixxer 150", slug: "gixxer-150", marca: marcaMotoDocs["suzuki"], anio_desde: 2019, anio_hasta: 2026 },
      { nombre: "Gixxer 250", slug: "gixxer-250", marca: marcaMotoDocs["suzuki"], anio_desde: 2020, anio_hasta: 2026 },
      { nombre: "V-Strom 250", slug: "v-strom-250", marca: marcaMotoDocs["suzuki"], anio_desde: 2020, anio_hasta: 2026 },
      // ── Honda (#5 Colombia 2025: 134,433 unidades, +51%) ──
      { nombre: "CB 160F", slug: "cb-160f", marca: marcaMotoDocs["honda"], anio_desde: 2020, anio_hasta: 2026 },
      { nombre: "XR 150L", slug: "xr-150l", marca: marcaMotoDocs["honda"], anio_desde: 2018, anio_hasta: 2026 },
      { nombre: "XR 190L", slug: "xr-190l", marca: marcaMotoDocs["honda"], anio_desde: 2021, anio_hasta: 2026 },
      { nombre: "Navi 110", slug: "navi-110", marca: marcaMotoDocs["honda"], anio_desde: 2023, anio_hasta: 2026 },
      { nombre: "CBF 125", slug: "cbf-125", marca: marcaMotoDocs["honda"], anio_desde: 2018, anio_hasta: 2026 },
      { nombre: "CB 500X", slug: "cb-500x", marca: marcaMotoDocs["honda"], anio_desde: 2019, anio_hasta: 2026 },
      { nombre: "XRE 300", slug: "xre-300", marca: marcaMotoDocs["honda"], anio_desde: 2019, anio_hasta: 2026 },
      // ── TVS (crecimiento fuerte) ──
      { nombre: "Raider 125", slug: "raider-125", marca: marcaMotoDocs["tvs"], anio_desde: 2022, anio_hasta: 2026 },
      { nombre: "Apache RTR 200", slug: "apache-rtr-200", marca: marcaMotoDocs["tvs"], anio_desde: 2019, anio_hasta: 2026 },
      { nombre: "Ntorq 125", slug: "ntorq-125", marca: marcaMotoDocs["tvs"], anio_desde: 2020, anio_hasta: 2026 },
      // ── Hero (+114% crecimiento) ──
      { nombre: "Splendor", slug: "splendor", marca: marcaMotoDocs["hero"], anio_desde: 2019, anio_hasta: 2026 },
      { nombre: "Hunk 125 R", slug: "hunk-125-r", marca: marcaMotoDocs["hero"], anio_desde: 2022, anio_hasta: 2026 },
      { nombre: "Hunk 160R", slug: "hunk-160r", marca: marcaMotoDocs["hero"], anio_desde: 2022, anio_hasta: 2026 },
      { nombre: "Xpulse 200", slug: "xpulse-200", marca: marcaMotoDocs["hero"], anio_desde: 2020, anio_hasta: 2026 },
      // ── KTM ──
      { nombre: "Duke 200", slug: "duke-200", marca: marcaMotoDocs["ktm"], anio_desde: 2017, anio_hasta: 2026 },
      { nombre: "Duke 390", slug: "duke-390", marca: marcaMotoDocs["ktm"], anio_desde: 2017, anio_hasta: 2026 },
      { nombre: "Adventure 390", slug: "adventure-390", marca: marcaMotoDocs["ktm"], anio_desde: 2020, anio_hasta: 2026 },
      // ── Kawasaki ──
      { nombre: "Z400", slug: "z400", marca: marcaMotoDocs["kawasaki"], anio_desde: 2019, anio_hasta: 2026 },
      { nombre: "Ninja 400", slug: "ninja-400", marca: marcaMotoDocs["kawasaki"], anio_desde: 2018, anio_hasta: 2026 },
      { nombre: "Versys-X 300", slug: "versys-x-300", marca: marcaMotoDocs["kawasaki"], anio_desde: 2018, anio_hasta: 2026 },
    ];

    const modeloDocs: Record<string, string> = {};
    for (const mod of modelos) {
      try {
        modeloDocs[mod.slug] = await upsert("api::modelo-moto.modelo-moto", "slug", mod);
      } catch (err: any) {
        console.error(`[Seed] Error Modelo ${mod.nombre}:`, err.message);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // 4. PRODUCTOS PILOTO — gama baja y media (mercado colombiano)
    //    Precios reales COP: cascos $95K-$550K, guantes $45K-$240K
    // ═══════════════════════════════════════════════════════════════
    const productosPiloto = [
      // ── Cascos económicos ──
      {
        nombre: "Casco ICH 3110 Integral Certificado",
        slug: "casco-ich-3110-integral",
        precio: 145000,
        descripcion: "Casco integral básico certificado NTC 4533. Visor transparente incluido, ventilación frontal. Ideal para uso urbano diario.",
        referencia: "CAS-ICH-3110",
        categoria: catDocs["cascos"],
        marca: marcaDocs["ich"],
        variantes_piloto: [
          { talla: "S", color: "Negro Mate", cantidad_stock: 20 },
          { talla: "M", color: "Negro Mate", cantidad_stock: 25 },
          { talla: "L", color: "Negro Mate", cantidad_stock: 18 },
          { talla: "XL", color: "Negro Mate", cantidad_stock: 10 },
          { talla: "M", color: "Blanco", cantidad_stock: 12 },
          { talla: "L", color: "Blanco", cantidad_stock: 10 },
        ],
      },
      {
        nombre: "Casco ICH 501R Abatible",
        slug: "casco-ich-501r-abatible",
        precio: 189000,
        descripcion: "Casco abatible económico con doble visor (solar interno). Certificado NTC 4533. Cierre micrométrico.",
        referencia: "CAS-ICH-501R",
        categoria: catDocs["cascos"],
        marca: marcaDocs["ich"],
        variantes_piloto: [
          { talla: "M", color: "Negro Brillante", cantidad_stock: 15 },
          { talla: "L", color: "Negro Brillante", cantidad_stock: 12 },
          { talla: "XL", color: "Negro Brillante", cantidad_stock: 8 },
          { talla: "M", color: "Gris Titanio", cantidad_stock: 6 },
          { talla: "L", color: "Gris Titanio", cantidad_stock: 5 },
        ],
      },
      // ── Cascos gama media ──
      {
        nombre: "Casco Shaft SH-520 Integral",
        slug: "casco-shaft-sh-520-integral",
        precio: 289000,
        descripcion: "Casco integral en policarbonato con ventilación superior y trasera. Visor con preparación pinlock. Certificado NTC 4533 y DOT.",
        referencia: "CAS-SHF-520",
        categoria: catDocs["cascos"],
        marca: marcaDocs["shaft"],
        variantes_piloto: [
          { talla: "S", color: "Negro Mate", cantidad_stock: 10 },
          { talla: "M", color: "Negro Mate", cantidad_stock: 15 },
          { talla: "L", color: "Negro Mate", cantidad_stock: 12 },
          { talla: "M", color: "Azul/Negro", cantidad_stock: 6 },
          { talla: "L", color: "Azul/Negro", cantidad_stock: 5 },
          { talla: "XL", color: "Negro Mate", cantidad_stock: 8 },
        ],
      },
      {
        nombre: "Casco MT Thunder 4 SV",
        slug: "casco-mt-thunder-4-sv",
        precio: 385000,
        descripcion: "Casco integral en HIPS con visor solar interno retráctil. Sistema de ventilación de 3 canales. Certificación ECE 22.06.",
        referencia: "CAS-MT-TH4SV",
        categoria: catDocs["cascos"],
        marca: marcaDocs["mt-helmets"],
        variantes_piloto: [
          { talla: "S", color: "Negro Mate", cantidad_stock: 8 },
          { talla: "M", color: "Negro Mate", cantidad_stock: 12 },
          { talla: "L", color: "Negro Mate", cantidad_stock: 10 },
          { talla: "M", color: "Rojo/Negro", cantidad_stock: 5 },
          { talla: "L", color: "Rojo/Negro", cantidad_stock: 4 },
          { talla: "XL", color: "Negro Mate", cantidad_stock: 6 },
        ],
      },
      {
        nombre: "Casco LS2 FF353 Rapid II",
        slug: "casco-ls2-ff353-rapid-ii",
        precio: 420000,
        descripcion: "Casco integral HPTT (resina de alta resistencia). Visor antivaho con pinlock ready. Sistema de extracción de emergencia.",
        referencia: "CAS-LS2-353R",
        categoria: catDocs["cascos"],
        marca: marcaDocs["ls2"],
        variantes_piloto: [
          { talla: "S", color: "Negro Mate", cantidad_stock: 7 },
          { talla: "M", color: "Negro Mate", cantidad_stock: 10 },
          { talla: "L", color: "Negro Mate", cantidad_stock: 8 },
          { talla: "M", color: "Blanco/Azul", cantidad_stock: 4 },
          { talla: "L", color: "Blanco/Azul", cantidad_stock: 4 },
        ],
      },
      // ── Guantes ──
      {
        nombre: "Guantes Pigmalion Vortex Cortos",
        slug: "guantes-pigmalion-vortex-cortos",
        precio: 179900,
        descripcion: "Guantes cortos en cuero sintético con protección en nudillos. Palma reforzada con insertos antideslizantes. Touch screen compatibles.",
        referencia: "GUA-PIG-VRTX",
        categoria: catDocs["guantes"],
        marca: marcaDocs["pigmalion"],
        variantes_piloto: [
          { talla: "S", color: "Negro", cantidad_stock: 15 },
          { talla: "M", color: "Negro", cantidad_stock: 20 },
          { talla: "L", color: "Negro", cantidad_stock: 18 },
          { talla: "XL", color: "Negro", cantidad_stock: 10 },
          { talla: "M", color: "Negro/Rojo", cantidad_stock: 8 },
          { talla: "L", color: "Negro/Rojo", cantidad_stock: 7 },
        ],
      },
      {
        nombre: "Guantes Pigmalion Raptor Largos",
        slug: "guantes-pigmalion-raptor-largos",
        precio: 239900,
        descripcion: "Guantes largos con protección rígida en nudillos y dorso. Palma de cuero con refuerzo en palma y dedos. Cierre velcro en muñeca.",
        referencia: "GUA-PIG-RPTR",
        categoria: catDocs["guantes"],
        marca: marcaDocs["pigmalion"],
        variantes_piloto: [
          { talla: "M", color: "Negro", cantidad_stock: 12 },
          { talla: "L", color: "Negro", cantidad_stock: 10 },
          { talla: "XL", color: "Negro", cantidad_stock: 6 },
          { talla: "L", color: "Negro/Gris", cantidad_stock: 5 },
        ],
      },
      {
        nombre: "Guantes Shaft 310 Touring",
        slug: "guantes-shaft-310-touring",
        precio: 135000,
        descripcion: "Guantes textiles impermeables con membrana interna. Protección en nudillos, palma reforzada. Ideales para lluvia.",
        referencia: "GUA-SHF-310",
        categoria: catDocs["guantes"],
        marca: marcaDocs["shaft-gear"],
        variantes_piloto: [
          { talla: "M", color: "Negro", cantidad_stock: 18 },
          { talla: "L", color: "Negro", cantidad_stock: 15 },
          { talla: "XL", color: "Negro", cantidad_stock: 10 },
        ],
      },
      // ── Chaquetas ──
      {
        nombre: "Chaqueta Pigmalion Cortavientos Urban",
        slug: "chaqueta-pigmalion-cortavientos",
        precio: 99900,
        descripcion: "Cortavientos ligero con forro de malla transpirable. Bolsillos con cierre, bandas reflectivas. Ideal para clima templado.",
        referencia: "CHA-PIG-CVNT",
        categoria: catDocs["chaquetas"],
        marca: marcaDocs["pigmalion"],
        variantes_piloto: [
          { talla: "S", color: "Negro", cantidad_stock: 15 },
          { talla: "M", color: "Negro", cantidad_stock: 20 },
          { talla: "L", color: "Negro", cantidad_stock: 18 },
          { talla: "XL", color: "Negro", cantidad_stock: 10 },
          { talla: "M", color: "Gris/Negro", cantidad_stock: 8 },
          { talla: "L", color: "Gris/Negro", cantidad_stock: 7 },
        ],
      },
      {
        nombre: "Chaqueta Pigmalion Body Armor Xplorer",
        slug: "chaqueta-pigmalion-body-armor-xplorer",
        precio: 299900,
        descripcion: "Chaqueta con protecciones certificadas CE en hombros, codos y espalda. Textil resistente a la abrasión. Forro térmico desmontable.",
        referencia: "CHA-PIG-BAXP",
        categoria: catDocs["chaquetas"],
        marca: marcaDocs["pigmalion"],
        variantes_piloto: [
          { talla: "M", color: "Negro", cantidad_stock: 8 },
          { talla: "L", color: "Negro", cantidad_stock: 10 },
          { talla: "XL", color: "Negro", cantidad_stock: 6 },
          { talla: "M", color: "Negro/Verde", cantidad_stock: 4 },
          { talla: "L", color: "Negro/Verde", cantidad_stock: 5 },
          { talla: "XXL", color: "Negro", cantidad_stock: 3 },
        ],
      },
      {
        nombre: "Chaqueta Pigmalion Fenix Touring",
        slug: "chaqueta-pigmalion-fenix-touring",
        precio: 459900,
        descripcion: "Chaqueta touring de 4 estaciones con membrana impermeable desmontable. Protecciones CE nivel 2. Ventilación regulable frontal y trasera.",
        referencia: "CHA-PIG-FNX",
        categoria: catDocs["chaquetas"],
        marca: marcaDocs["pigmalion"],
        variantes_piloto: [
          { talla: "M", color: "Negro/Gris", cantidad_stock: 5 },
          { talla: "L", color: "Negro/Gris", cantidad_stock: 6 },
          { talla: "XL", color: "Negro/Gris", cantidad_stock: 4 },
          { talla: "L", color: "Negro/Naranja", cantidad_stock: 3 },
        ],
      },
      // ── Impermeables ──
      {
        nombre: "Impermeable Shaft SH-701 Conjunto",
        slug: "impermeable-shaft-sh-701",
        precio: 149900,
        descripcion: "Conjunto impermeable de 2 piezas (chaqueta + pantalón). Costuras selladas, capucha plegable. Bolso de transporte incluido.",
        referencia: "IMP-SHF-701",
        categoria: catDocs["impermeables"],
        marca: marcaDocs["shaft-gear"],
        variantes_piloto: [
          { talla: "M", color: "Negro/Gris", cantidad_stock: 20 },
          { talla: "L", color: "Negro/Gris", cantidad_stock: 25 },
          { talla: "XL", color: "Negro/Gris", cantidad_stock: 15 },
          { talla: "XXL", color: "Negro/Gris", cantidad_stock: 8 },
        ],
      },
      // ── Protección corporal ──
      {
        nombre: "Rodilleras Pigmalion Pro Guard",
        slug: "rodilleras-pigmalion-pro-guard",
        precio: 89900,
        descripcion: "Par de rodilleras articuladas con protección CE nivel 1. Correas ajustables, uso bajo el pantalón o sobre la ropa.",
        referencia: "PRO-PIG-RDLL",
        categoria: catDocs["proteccion-corporal"],
        marca: marcaDocs["pigmalion"],
        variantes_piloto: [
          { talla: "UNICA", color: "Negro", cantidad_stock: 25 },
        ],
      },
    ];

    for (const p of productosPiloto) {
      try {
        const existing = await strapi.documents("api::producto-piloto.producto-piloto").findFirst({
          filters: { referencia: p.referencia },
        });
        if (!existing) {
          await strapi.documents("api::producto-piloto.producto-piloto").create({ data: p, status: "published" });
          console.log(`[Seed] Producto Piloto: ${p.nombre}`);
        }
      } catch (err: any) {
        console.error(`[Seed] Error Producto Piloto ${p.nombre}:`, err.message);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // 5. PRODUCTOS MOTO — gama baja y media (mercado colombiano)
    //    Compatibilidades con motos más vendidas: Pulsar, NKD, Nmax, DR150
    // ═══════════════════════════════════════════════════════════════
    const productosMoto = [
      // ── Maniguetas y Mandos (lo más vendido en accesorios) ──
      {
        nombre: "Maniguetas Abatibles CNC Pulsar/Duke",
        slug: "maniguetas-abatibles-cnc-pulsar-duke",
        precio: 65000,
        descripcion: "Juego de maniguetas (freno + clutch) abatibles en aluminio CNC. Evitan rotura en caídas. Colores disponibles.",
        referencia: "MAN-GEN-PULS",
        categoria: catDocs["maniguetas-mandos"],
        marca: marcaDocs["generica"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-ns-200"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-n250"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["dominar-400"] },
          { marca_moto: marcaMotoDocs["ktm"], modelo_moto: modeloDocs["duke-200"] },
          { marca_moto: marcaMotoDocs["ktm"], modelo_moto: modeloDocs["duke-390"] },
        ],
      },
      {
        nombre: "Maniguetas Abatibles CNC NKD/Gixxer",
        slug: "maniguetas-abatibles-cnc-nkd-gixxer",
        precio: 55000,
        descripcion: "Juego de maniguetas abatibles universales en aluminio. Compatible con mandos tipo Suzuki/AKT. Anti-rotura.",
        referencia: "MAN-GEN-NKDG",
        categoria: catDocs["maniguetas-mandos"],
        marca: marcaDocs["generica"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["akt"], modelo_moto: modeloDocs["nkd-125"] },
          { marca_moto: marcaMotoDocs["akt"], modelo_moto: modeloDocs["cr4-125"] },
          { marca_moto: marcaMotoDocs["suzuki"], modelo_moto: modeloDocs["gixxer-150"] },
          { marca_moto: marcaMotoDocs["suzuki"], modelo_moto: modeloDocs["gn-125"] },
        ],
      },
      // ── Iluminación ──
      {
        nombre: "Kit Farola LED Universal 6000K",
        slug: "kit-farola-led-universal-6000k",
        precio: 85000,
        descripcion: "Farola LED H4 de alta luminosidad (6000K blanco frío). Ventilador integrado para disipación. Plug & play, no requiere adaptador.",
        referencia: "ILU-GEN-LEDH4",
        categoria: catDocs["iluminacion"],
        marca: marcaDocs["generica"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-ns-200"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["boxer-ct-100"] },
          { marca_moto: marcaMotoDocs["akt"], modelo_moto: modeloDocs["nkd-125"] },
          { marca_moto: marcaMotoDocs["suzuki"], modelo_moto: modeloDocs["gn-125"] },
          { marca_moto: marcaMotoDocs["honda"], modelo_moto: modeloDocs["cbf-125"] },
          { marca_moto: marcaMotoDocs["hero"], modelo_moto: modeloDocs["splendor"] },
        ],
      },
      {
        nombre: "Exploradoras LED Auxiliares 12V (Par)",
        slug: "exploradoras-led-auxiliares-12v-par",
        precio: 120000,
        descripcion: "Par de exploradoras LED 20W cada una con soporte universal en aluminio. Luz blanca de largo alcance. Incluye switch e instalación.",
        referencia: "ILU-GEN-EXPL",
        categoria: catDocs["iluminacion"],
        marca: marcaDocs["generica"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["yamaha"], modelo_moto: modeloDocs["xtz-125"] },
          { marca_moto: marcaMotoDocs["honda"], modelo_moto: modeloDocs["xr-150l"] },
          { marca_moto: marcaMotoDocs["honda"], modelo_moto: modeloDocs["xr-190l"] },
          { marca_moto: marcaMotoDocs["suzuki"], modelo_moto: modeloDocs["dr-150"] },
          { marca_moto: marcaMotoDocs["hero"], modelo_moto: modeloDocs["xpulse-200"] },
        ],
      },
      {
        nombre: "Direccionales LED Secuenciales (Par)",
        slug: "direccionales-led-secuenciales-par",
        precio: 45000,
        descripcion: "Par de direccionales LED con efecto secuencial ámbar. Universales 12V, carcasa en plástico resistente. Bajo consumo.",
        referencia: "ILU-GEN-DIRS",
        categoria: catDocs["iluminacion"],
        marca: marcaDocs["generica"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-ns-200"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-n160"] },
          { marca_moto: marcaMotoDocs["akt"], modelo_moto: modeloDocs["nkd-125"] },
          { marca_moto: marcaMotoDocs["yamaha"], modelo_moto: modeloDocs["fz-s-fi-150"] },
          { marca_moto: marcaMotoDocs["suzuki"], modelo_moto: modeloDocs["gixxer-150"] },
        ],
      },
      // ── Protección Moto ──
      {
        nombre: "Sliders Protectores Rinometal Pulsar NS 200",
        slug: "sliders-rinometal-pulsar-ns-200",
        precio: 145000,
        descripcion: "Sliders en acero inoxidable y nylon de alta densidad fabricados en Bogotá. Protegen motor y carenaje en caídas.",
        referencia: "PRO-RNM-PLNS",
        categoria: catDocs["proteccion-moto"],
        marca: marcaDocs["rinometal"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-ns-200"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-n250"] },
        ],
      },
      {
        nombre: "Defensa Lateral Rinometal NKD 125",
        slug: "defensa-lateral-rinometal-nkd-125",
        precio: 95000,
        descripcion: "Defensa lateral en tubo de acero con recubrimiento electrostático. Protege motor y piernas del piloto.",
        referencia: "PRO-RNM-NKD",
        categoria: catDocs["proteccion-moto"],
        marca: marcaDocs["rinometal"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["akt"], modelo_moto: modeloDocs["nkd-125"] },
          { marca_moto: marcaMotoDocs["akt"], modelo_moto: modeloDocs["ak-125-flex"] },
        ],
      },
      {
        nombre: "Protector de Farola Acero Inox XR 150L",
        slug: "protector-farola-rinometal-xr-150l",
        precio: 75000,
        descripcion: "Protector de farola en acero inoxidable. Evita daños en piedras y ramas. Instalación con tornillería incluida.",
        referencia: "PRO-RNM-XRFR",
        categoria: catDocs["proteccion-moto"],
        marca: marcaDocs["rinometal"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["honda"], modelo_moto: modeloDocs["xr-150l"] },
          { marca_moto: marcaMotoDocs["honda"], modelo_moto: modeloDocs["xr-190l"] },
        ],
      },
      // ── Frenos ──
      {
        nombre: "Pastillas de Freno Fire Parts Delanteras Pulsar",
        slug: "pastillas-freno-fire-parts-pulsar",
        precio: 35000,
        descripcion: "Pastillas de freno delanteras semimetálicas. Buena mordida en seco y mojado. Desgaste uniforme.",
        referencia: "FRE-FP-PULSD",
        categoria: catDocs["frenos"],
        marca: marcaDocs["fire-parts"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-ns-200"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-n160"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-rs-200"] },
        ],
      },
      {
        nombre: "Pastillas de Freno Fire Parts Delanteras NKD/GN",
        slug: "pastillas-freno-fire-parts-nkd-gn",
        precio: 28000,
        descripcion: "Pastillas de freno delanteras para motos de bajo cilindraje. Material orgánico, frenado suave y progresivo.",
        referencia: "FRE-FP-NKDGN",
        categoria: catDocs["frenos"],
        marca: marcaDocs["fire-parts"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["akt"], modelo_moto: modeloDocs["nkd-125"] },
          { marca_moto: marcaMotoDocs["suzuki"], modelo_moto: modeloDocs["gn-125"] },
          { marca_moto: marcaMotoDocs["honda"], modelo_moto: modeloDocs["cbf-125"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["discover-125"] },
        ],
      },
      // ── Llantas ──
      {
        nombre: "Llanta IRC NR73 2.75-17 Trasera",
        slug: "llanta-irc-nr73-275-17",
        precio: 95000,
        descripcion: "Llanta convencional trasera de uso mixto (asfalto/destapado). Patrón de alto agarre en mojado. Refuerzo de nylon.",
        referencia: "LLA-IRC-NR73",
        categoria: catDocs["llantas"],
        marca: marcaDocs["irc"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["boxer-ct-100"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["discover-125"] },
          { marca_moto: marcaMotoDocs["hero"], modelo_moto: modeloDocs["splendor"] },
          { marca_moto: marcaMotoDocs["akt"], modelo_moto: modeloDocs["nkd-125"] },
        ],
      },
      {
        nombre: "Llanta Pirelli Diablo Rosso II 110/70-17",
        slug: "llanta-pirelli-diablo-rosso-ii-110-70-17",
        precio: 320000,
        descripcion: "Llanta deportiva delantera radial. Compuesto bi-mescla para máximo agarre en curva. Para motos 200-400cc.",
        referencia: "LLA-PIR-DRII",
        categoria: catDocs["llantas"],
        marca: marcaDocs["pirelli"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-ns-200"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["dominar-400"] },
          { marca_moto: marcaMotoDocs["ktm"], modelo_moto: modeloDocs["duke-200"] },
          { marca_moto: marcaMotoDocs["yamaha"], modelo_moto: modeloDocs["mt-03"] },
          { marca_moto: marcaMotoDocs["kawasaki"], modelo_moto: modeloDocs["z400"] },
        ],
      },
      // ── Accesorios ──
      {
        nombre: "Baúl Top Case Shad SH26 26L",
        slug: "baul-shad-sh26-26l",
        precio: 245000,
        descripcion: "Baúl superior de 26 litros con capacidad para un casco integral. Sistema de apertura con llave. Base universal incluida.",
        referencia: "ACC-SHD-SH26",
        categoria: catDocs["accesorios-moto"],
        marca: marcaDocs["shad"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["yamaha"], modelo_moto: modeloDocs["nmax-155"] },
          { marca_moto: marcaMotoDocs["honda"], modelo_moto: modeloDocs["cb-160f"] },
          { marca_moto: marcaMotoDocs["suzuki"], modelo_moto: modeloDocs["address-110"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["discover-125"] },
          { marca_moto: marcaMotoDocs["tvs"], modelo_moto: modeloDocs["ntorq-125"] },
        ],
      },
      {
        nombre: "Parrilla Trasera Rinometal Nmax 155",
        slug: "parrilla-trasera-rinometal-nmax-155",
        precio: 110000,
        descripcion: "Parrilla trasera en acero con acabado electrostático negro. Soporta hasta 5kg. Instalación con tornillería original.",
        referencia: "ACC-RNM-NMXP",
        categoria: catDocs["accesorios-moto"],
        marca: marcaDocs["rinometal"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["yamaha"], modelo_moto: modeloDocs["nmax-155"] },
        ],
      },
      // ── Escapes ──
      {
        nombre: "Escape Deportivo Fire Parts Pulsar NS 200",
        slug: "escape-deportivo-fire-parts-pulsar-ns-200",
        precio: 380000,
        descripcion: "Escape slip-on deportivo en acero inoxidable con punta de fibra de carbono. Mejora respuesta en rango medio. Sonido deportivo controlado.",
        referencia: "ESC-FP-PLNS",
        categoria: catDocs["escapes"],
        marca: marcaDocs["fire-parts"],
        compatibilidades: [
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-ns-200"] },
          { marca_moto: marcaMotoDocs["bajaj"], modelo_moto: modeloDocs["pulsar-rs-200"] },
        ],
      },
    ];

    for (const p of productosMoto) {
      try {
        const existing = await strapi.documents("api::producto-moto.producto-moto").findFirst({
          filters: { referencia: p.referencia },
        });
        if (!existing) {
          await strapi.documents("api::producto-moto.producto-moto").create({ data: p, status: "published" });
          console.log(`[Seed] Producto Moto: ${p.nombre}`);
        }
      } catch (err: any) {
        console.error(`[Seed] Error Producto Moto ${p.nombre}:`, err.message);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // 6. PERMISOS PÚBLICOS (lectura para todas las colecciones)
    // ═══════════════════════════════════════════════════════════════
    try {
      const publicRole = await strapi.query("plugin::users-permissions.role").findOne({
        where: { type: "public" },
      });

      if (publicRole) {
        const actions = [
          "api::categoria.categoria.find",
          "api::categoria.categoria.findOne",
          "api::marca.marca.find",
          "api::marca.marca.findOne",
          "api::marca-moto.marca-moto.find",
          "api::marca-moto.marca-moto.findOne",
          "api::modelo-moto.modelo-moto.find",
          "api::modelo-moto.modelo-moto.findOne",
          "api::producto-moto.producto-moto.find",
          "api::producto-moto.producto-moto.findOne",
          "api::producto-piloto.producto-piloto.find",
          "api::producto-piloto.producto-piloto.findOne",
          "api::pedido.pedido.find",
          "api::pedido.pedido.findOne",
          "api::pedido.pedido.create",
          "api::whats-app-event.whats-app-event.intent",
          "api::whats-app-event.whats-app-event.open",
        ];

        for (const action of actions) {
          const exists = await strapi.query("plugin::users-permissions.permission").findOne({
            where: { role: publicRole.id, action },
          });
          if (!exists) {
            await strapi.query("plugin::users-permissions.permission").create({
              data: { role: publicRole.id, action },
            });
            console.log(`[Seed] Permiso: ${action}`);
          }
        }
      }
    } catch (err: any) {
      console.error("[Seed] Error permisos:", err.message);
    }

    console.log("[Seed] ¡Seed completado!");
  },
};
