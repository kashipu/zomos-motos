// ── Tipos ──────────────────────────────────────────────────────

export interface Variante {
  id: number;
  talla: string;
  color: string;
  cantidad_stock: number;
}

export interface Compatibilidad {
  id: number;
  marca_moto: { id: number; nombre: string; slug: string } | null;
  modelo_moto: { id: number; nombre: string; slug: string; anio_desde?: number; anio_hasta?: number } | null;
}

export interface Producto {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  precio: number;
  referencia: string;
  descripcion: string | null;
  tipo: "moto" | "piloto";
  descuento: number; // % de descuento (0-100)
  imagenes: { url: string; alternativeText?: string }[];
  categoria: { id: number; nombre: string; slug: string; tipo: string } | null;
  marca: { id: number; nombre: string; slug: string } | null;
  // Solo piloto
  variantes?: Variante[];
  // Solo moto
  compatibilidades?: Compatibilidad[];
}

export interface Categoria {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  tipo: "MOTO" | "PILOTO" | "UNIVERSAL";
  descripcion?: string;
}

export interface MarcaMoto {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  logo?: { url: string };
}

export interface ModeloMoto {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  anio_desde?: number;
  anio_hasta?: number;
  marca?: { id: number; nombre: string; slug: string };
}

export interface Marca {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  logo?: { url: string };
}

// ── Helpers ────────────────────────────────────────────────────

export function getStrapiMedia(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${import.meta.env.PUBLIC_STRAPI_URL}${url}`;
}

const PLACEHOLDER_IMAGE = "/assets/placeholder-product.svg";

export function getImageUrl(producto: Producto): string {
  const img = producto.imagenes?.[0];
  return img ? (getStrapiMedia(img.url) ?? PLACEHOLDER_IMAGE) : PLACEHOLDER_IMAGE;
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Precio con descuento aplicado */
export function precioConDescuento(precio: number, descuento: number): number {
  if (!descuento || descuento <= 0) return precio;
  return Math.round(precio * (1 - descuento / 100));
}

/** Texto legible de compatibilidades: "Yamaha MT-09, Honda CB500F" */
export function compatibilidadTexto(items: Compatibilidad[]): string {
  return items
    .map((c) => {
      const marca = c.marca_moto?.nombre ?? "";
      const modelo = c.modelo_moto?.nombre ?? "";
      return `${marca} ${modelo}`.trim();
    })
    .filter(Boolean)
    .join(", ");
}

// ── Fetch genérico ─────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function queryStrapi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options;
  const url = new URL(`${import.meta.env.PUBLIC_STRAPI_URL}/api/${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  if (import.meta.env.PUBLIC_DEBUG_MODE === "true") {
    console.log(`[queryStrapi] ${url.toString()}`);
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  if (!response.ok) {
    throw new Error(`Strapi Error: ${response.statusText} (${response.status})`);
  }

  const json = await response.json();
  return json.data;
}

// ── Queries de producto ────────────────────────────────────────

// Strapi v5 requiere populate con índices numéricos para media fields
const POPULATE_MOTO: Record<string, string> = {
  "populate[0]": "imagenes",
  "populate[1]": "categoria",
  "populate[2]": "marca",
  "populate[3]": "compatibilidades.marca_moto",
  "populate[4]": "compatibilidades.modelo_moto",
  "populate[5]": "metadatos_seo",
};
const POPULATE_PILOTO: Record<string, string> = {
  "populate[0]": "imagenes",
  "populate[1]": "categoria",
  "populate[2]": "marca",
  "populate[3]": "variantes_piloto",
  "populate[4]": "metadatos_seo",
};

function normalizeMoto(raw: any): Producto {
  return {
    id: raw.id,
    documentId: raw.documentId,
    nombre: raw.nombre,
    slug: raw.slug,
    precio: raw.precio,
    referencia: raw.referencia || "",
    descripcion: raw.descripcion || null,
    tipo: "moto",
    descuento: raw.descuento || 0,
    imagenes: raw.imagenes || [],
    categoria: raw.categoria || null,
    marca: raw.marca || null,
    compatibilidades: raw.compatibilidades || [],
  };
}

function normalizePiloto(raw: any): Producto {
  return {
    id: raw.id,
    documentId: raw.documentId,
    nombre: raw.nombre,
    slug: raw.slug,
    precio: raw.precio,
    referencia: raw.referencia || "",
    descripcion: raw.descripcion || null,
    tipo: "piloto",
    descuento: raw.descuento || 0,
    imagenes: raw.imagenes || [],
    categoria: raw.categoria || null,
    marca: raw.marca || null,
    variantes: raw.variantes_piloto || [],
  };
}

interface ProductFilters {
  tipo?: "moto" | "piloto";
  categoriaSlug?: string;
  marcaSlug?: string;
  marcaMotoSlug?: string;
  modeloMotoSlug?: string;
  minPrice?: string;
  maxPrice?: string;
  limit?: number;
}

export async function fetchProductos(filters: ProductFilters = {}): Promise<Producto[]> {
  const { tipo, categoriaSlug, marcaSlug, marcaMotoSlug, modeloMotoSlug, minPrice, maxPrice, limit } = filters;

  const buildParams = (populate: Record<string, string>, isMoto: boolean) => {
    const p: Record<string, string | number | boolean> = { ...populate };
    if (categoriaSlug) p["filters[categoria][slug][$eq]"] = categoriaSlug;
    if (marcaSlug) p["filters[marca][slug][$eq]"] = marcaSlug;
    if (minPrice) p["filters[precio][$gte]"] = minPrice;
    if (maxPrice) p["filters[precio][$lte]"] = maxPrice;
    if (limit) p["pagination[limit]"] = limit;
    // Filtros de compatibilidad (solo para productos moto)
    if (isMoto && marcaMotoSlug) p["filters[compatibilidades][marca_moto][slug][$eq]"] = marcaMotoSlug;
    if (isMoto && modeloMotoSlug) p["filters[compatibilidades][modelo_moto][slug][$eq]"] = modeloMotoSlug;
    return p;
  };

  const promises: Promise<Producto[]>[] = [];

  // Si hay filtro de marca-moto o modelo, solo buscar en motos
  const soloMoto = !!marcaMotoSlug || !!modeloMotoSlug;

  if (!tipo || tipo === "moto") {
    promises.push(
      queryStrapi<any[]>("productos-motos", { params: buildParams(POPULATE_MOTO, true) })
        .then((data) => (data || []).map(normalizeMoto))
        .catch(() => [])
    );
  }

  if ((!tipo && !soloMoto) || tipo === "piloto") {
    promises.push(
      queryStrapi<any[]>("productos-pilotos", { params: buildParams(POPULATE_PILOTO, false) })
        .then((data) => (data || []).map(normalizePiloto))
        .catch(() => [])
    );
  }

  const results = await Promise.all(promises);
  const all = results.flat();
  return limit ? all.slice(0, limit) : all;
}

export async function fetchProductoBySlug(slug: string): Promise<Producto | null> {
  try {
    const data = await queryStrapi<any[]>("productos-motos", {
      params: {
        "filters[slug][$eq]": slug,
        ...POPULATE_MOTO,
      },
    });
    if (data?.length) return normalizeMoto(data[0]);
  } catch {}

  try {
    const data = await queryStrapi<any[]>("productos-pilotos", {
      params: {
        "filters[slug][$eq]": slug,
        ...POPULATE_PILOTO,
      },
    });
    if (data?.length) return normalizePiloto(data[0]);
  } catch {}

  return null;
}

export async function fetchCategorias(): Promise<Categoria[]> {
  try {
    return await queryStrapi<Categoria[]>("categorias", { params: { populate: "*" } });
  } catch {
    return [];
  }
}

export async function fetchMarcasMoto(): Promise<MarcaMoto[]> {
  try {
    return await queryStrapi<MarcaMoto[]>("marcas-motos", { params: { populate: "*", "pagination[limit]": 100 } });
  } catch {
    return [];
  }
}

export async function fetchModelosMoto(marcaMotoSlug?: string): Promise<ModeloMoto[]> {
  try {
    const params: Record<string, string | number | boolean> = {
      "populate[0]": "marca",
      "pagination[limit]": 200,
    };
    if (marcaMotoSlug) params["filters[marca][slug][$eq]"] = marcaMotoSlug;
    return await queryStrapi<ModeloMoto[]>("modelos-motos", { params });
  } catch {
    return [];
  }
}

export async function fetchMarcas(): Promise<Marca[]> {
  try {
    return await queryStrapi<Marca[]>("marcas", { params: { populate: "*", "pagination[limit]": 100 } });
  } catch {
    return [];
  }
}

/** Datos para la navegación: categorías separadas por tipo + marcas de moto */
export async function fetchNavData() {
  const [categorias, marcasMoto] = await Promise.all([
    fetchCategorias(),
    fetchMarcasMoto(),
  ]);
  return {
    categoriasMoto: categorias.filter((c) => c.tipo === "MOTO" || c.tipo === "UNIVERSAL"),
    categoriasPiloto: categorias.filter((c) => c.tipo === "PILOTO" || c.tipo === "UNIVERSAL"),
    marcasMoto,
  };
}

export async function fetchRelacionados(producto: Producto, limit = 4): Promise<Producto[]> {
  if (!producto.categoria) return [];
  const endpoint = producto.tipo === "moto" ? "productos-motos" : "productos-pilotos";
  const populate = producto.tipo === "moto" ? POPULATE_MOTO : POPULATE_PILOTO;
  const normalize = producto.tipo === "moto" ? normalizeMoto : normalizePiloto;

  try {
    const data = await queryStrapi<any[]>(endpoint, {
      params: {
        "filters[categoria][slug][$eq]": producto.categoria.slug,
        "filters[slug][$ne]": producto.slug,
        "pagination[limit]": limit,
        ...populate,
      },
    });
    return (data || []).map(normalize);
  } catch {
    return [];
  }
}
