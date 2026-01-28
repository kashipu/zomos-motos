# Guía de Despliegue - Zomos Motos (Dokploy)

## 1. Configuración de DNS
Crea estos registros en tu proveedor de dominio apuntando a la IP de tu VPS:

| Tipo | Host | Valor | Propósito |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `IP_VPS` | Storefront (`zomosmotos.com`) |
| **A** | `api` | `IP_VPS` | Backend (`api.zomosmotos.com`) |

---

## 2. Base de Datos (PostgreSQL)
- **Imagen:** `postgres:15` (o la versión seleccionada en Dokploy)
- **Database Name:** `zomos_db`
- **User:** `admin` (según configuración en captura)

---

## 3. Backend (Strapi v5)
- **Repo:** `https://github.com/kashipu/zomos-motos.git`
- **Branch:** `main`
- **Context Path:** `./backend`
- **Port:** `1337` (Interno)
- **Dominio:** `api.zomosmotos.com`

### Variables de Entorno (Backend)
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=zomos-motos-zomosdb-rrzqyz
DATABASE_PORT=5432
DATABASE_NAME=zomos_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=...
DATABASE_SSL=false

# Secretos (Copiar del .env local)
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...

# App Config
WHATSAPP_NUMBER=573028336170
PUBLIC_STRAPI_URL=https://api.zomosmotos.com
```

---

## 4. Storefront (Astro 5)
- **Repo:** `https://github.com/kashipu/zomos-motos.git`
- **Branch:** `main`
- **Context Path:** `./storefront`
- **Port:** `4321` (Interno)
- **Dominio:** `zomosmotos.com`

### Variables de Entorno (Storefront)
```env
# Opcional (el Dockerfile ya tiene https://api.zomosmotos.com por defecto)
PUBLIC_STRAPI_URL=https://api.zomosmotos.com
```

---

## 5. SSL y Despliegue
1. Dokploy gestiona **SSL automáticamente** mediante Traefik y Let's Encrypt al asignar el dominio.
2. Después de configurar las variables, realiza un **Redeploy** para asegurar que el build de Astro tome la URL de producción.
3. Verifica que `api.zomosmotos.com/admin` sea accesible para la gestión de productos.
