interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export function getStrapiMedia(url: string | null) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${import.meta.env.PUBLIC_STRAPI_URL}${url}`;
}

export async function queryStrapi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...init } = options;
  const url = new URL(`${import.meta.env.PUBLIC_STRAPI_URL}/api/${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  if (import.meta.env.PUBLIC_DEBUG_MODE === "true") {
    console.log(`[queryStrapi] Fetching: ${url.toString()}`);
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi Fetch Error: ${response.statusText} (${response.status})`);
  }

  const { data } = await response.json();
  return data;
}
