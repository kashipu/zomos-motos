# Guía de Instalación Local - Zomos Motos (Windows / PowerShell)

Esta guía detalla cómo configurar tu entorno de desarrollo local paso a paso en **Windows**, utilizando **PowerShell** y **Docker Desktop** para la infraestructura.

El objetivo es tener un repositorio listo para subir a GitHub y desplegar en Dokploy.

---

## 1. Prerrequisitos (Windows)
Asegúrate de tener instalado:
1.  **Docker Desktop**: [Descargar e instalar](https://www.docker.com/products/docker-desktop/).
    - **Importante:** Debe estar corriendo (icono de ballena en la barra de tareas).
2.  **Node.js (LTS)**: v20.x o superior. Comprueba en PowerShell: `node -v`.
3.  **Git**: Comprueba con `git --version`.
    - Si falla, instala [Git for Windows](https://git-scm.com/download/win).
4.  **Bun**: El gestor de paquetes y runtime extremadamente rápido.
    ```powershell
    powershell -c "irm https://bun.sh/install.ps1 | iex"
    ```
    > **Tip:** Reinicia tu terminal después de la instalación para que el comando `bun` esté disponible.

---

## 2. Inicialización del Proyecto (Monorepo)

Abre tu **PowerShell** en la carpeta donde guardas tus proyectos (ej: `C:\Users\TuUsuario\Proyectos`).

```powershell
# 1. Crear directorio raíz
New-Item -ItemType Directory -Force -Name zomos-motos
cd zomos-motos

# 2. Inicializar Git
git init

# 3. Crear archivo .gitignore raíz
# (Bloque de texto para PowerShell)
@"
node_modules
.DS_Store
.env
.env.*.local
dist
build
.vercel
.next
backend/node_modules
storefront/node_modules
pg_data
redis_data
"@ | Out-File -Encoding UTF8 .gitignore
```

---

## 3. Infraestructura Local (Docker)

Crearemos el archivo `docker-compose.yml` para levantar la Base de Datos y Redis.

**Archivo:** `zomos-motos/docker-compose.yml`
Crea este archivo manualmente en tu editor (VS Code) o usa el siguiente comando:

```powershell
# Crear archivo docker-compose.yml vacío para editarlo luego
New-Item docker-compose.yml
code docker-compose.yml
```

Pega el siguiente contenido en `docker-compose.yml`:
```yaml
version: '3.8'

services:
  # Base de Datos
  postgres:
    image: postgres:16-alpine
    container_name: zomos-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: zomos_db
    ports:
      - "5432:5432"
    volumes:
      - ./pg_data:/var/lib/postgresql/data

  # Cache y Eventos
  redis:
    image: redis:alpine
    container_name: zomos-redis
    ports:
      - "6379:6379"
    volumes:
      - ./redis_data:/data
```

**Comando para iniciar infraestructura:**
```powershell
docker compose up -d
```
*Verifica que no haya errores. Si es la primera vez, Docker tardará un poco descargando las imágenes.*

### 3.1 Conexión con PGAdmin (Paso a Paso)
Una vez abierto PGAdmin:
1.  En la barra lateral izquierda, haz clic derecho en **Servers**.
2.  Selecciona **Register** > **Server...**.
3.  En la pestaña **General**:
    - **Name**: `Zomos Local` (o el nombre que quieras).
4.  En la pestaña **Connection**:
    - **Host name/address**: `localhost`
    - **Port**: `5432`
    - **Maintenance database**: `zomos_db`
    - **Username**: `postgres`
    - **Password**: `postgres`
5.  Haz clic en **Save**.

¡Listo! Ahora verás `Zomos Local` en la lista. Si despliegas `Databases`, verás `zomos_db`.



---

## 4. Configuración del Backend (Strapi)

```powershell
# Estando en la raíz /zomos-motos

# 1. Crear proyecto Strapi
# Usamos bunx para una instalación rápida
bunx create-strapi-app@latest backend --quickstart --no-run

# 2. Entrar y configurar para Postgres
cd backend
# Strapi pedirá configurar la DB si no es modo --quickstart. 
# Se recomienda editar .env con los datos de docker-compose.
```

**Configuración (.env):**
Asegúrate de que el archivo `backend/.env` tenga las variables correctas:
```ini
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=zomos_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
```

**Iniciar Backend:**
```powershell
# En terminal /backend
bun dev
```
*El backend debe responder en `http://localhost:1337/admin`.*

---

## 5. Configuración del Frontend (Astro)

Abre **otra ventana de PowerShell** para el frontend.

```powershell
# Vuelve a la raíz
cd ..

# 1. Crear Astro App
# Usamos bunx para una instalación rápida
bunx create-astro@latest storefront -- --template minimal --no-install --no-git

# 2. Instalar dependencias e integraciones
cd storefront
bun install
bun astro add react tailwind sitemap
```

**Configuración (.env):**
Crea el archivo `storefront/.env`:
```ini
STRAPI_URL=http://localhost:1337
```

**Iniciar Frontend:**
```powershell
# En terminal /storefront
bun run dev
```
*Abre `http://localhost:4321` en tu navegador.*

---

## 6. Comandos Útiles (Cheatsheet Windows)

| Acción | Comando PowerShell |
| :--- | :--- |
| **Levantar DB** | `docker compose up -d` (en raíz) |
| **Apagar DB** | `docker compose down` |
| **Ver Logs Backend** | `Get-Content backend.log -Wait` (si usas logs a archivo) |
| **Limpiar puertos** | Si un puerto se queda pegado: `Get-Process -Id (Get-NetTCPConnection -LocalPort 1337).OwningProcess | Stop-Process` |

---

## 7. Preparación final
1.  **Commit:** `git add .`, `git commit -m "Init"`
2.  **Push:** `git push origin main`
