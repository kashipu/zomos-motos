# Guía de Despliegue - Zomos Motos (Dokploy)

## Infraestructura Objetivo
- **Servidor:** VPS (Ubuntu 22.04+ recomendado)
- **Gestor:** Dokploy (Open Source DevOps Platform)
- **Reverse Proxy:** Traefik (integrado en Dokploy)

## Servicios a Desplegar

### 1. Base de Datos (PostgreSQL)
- **Imagen:** `postgres:16-alpine`
- **Volumen:** `pg_data_prod` -> `/var/lib/postgresql/data`
- **Variables de Entorno:**
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`

### 2. Cache & Mensajería (Redis)
- **Imagen:** `redis:alpine`
- **Volumen:** `redis_data` -> `/data`
- **Configuración:** `appendonly yes` (para persistencia mínima)

### 3. Backend (Strapi CMS)
- **Tipo:** Application (Dockerfile)
- **Contexto de Build:** `./backend`
- **Variables de Env:**
  - `DATABASE_CLIENT`: `postgres`
  - `DATABASE_URL`: `postgres://user:pass@postgres_service:5432/zomos_db`
  - `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT` (Strapi 5 mandatory)
  - `CORS_ORIGIN`: `https://zomos-motos.com`
  - `PORT`: `1337`

### 4. Frontend (Astro Storefront)
- **Tipo:** Application (Dockerfile)
- **Contexto de Build:** `./storefront`
- **Variables de Entorno:**
    - `STRAPI_URL`: `https://api.zomos-motos.com`
    - `PORT`: `4321`

## 4. Dominios y SSL
Dokploy gestiona automáticamente los certificados con Let's Encrypt:
- `api.zomos-motos.com` -> Backend Service (Puerto 1337)
- `tienda.zomos-motos.com` -> Frontend Service (Puerto 4321)
- `admin.zomos-motos.com` -> Backend Service (Puerto 1337 + ruta /admin)

Dokploy gestiona automáticamente los certificados SSL (Let's Encrypt).
