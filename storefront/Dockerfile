# Dockerfile for Astro SSR (Dokploy)
# Uses Node 22 to ensure compatibility with sharp and latest Astro features.

# 1. Build Stage
FROM node:22-slim AS build
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
# We use standard npm run build which calls "astro build"
ARG PUBLIC_STRAPI_URL
ENV PUBLIC_STRAPI_URL=${PUBLIC_STRAPI_URL}
RUN npm run build

# 2. Runtime Stage
FROM node:22-slim AS runtime
WORKDIR /app

# Copy built assets from build stage
# COPY --from=build /app/dist ./dist # Astro default output is dist/
COPY --from=build /app/dist ./dist
# We might need node_modules for some runtime deps (like sharp), 
# although 'standalone' mode bundles most things. 
# Just in case, let's copy node_modules or reinstall prod deps.
# 'standalone' mode usually creates a standalone server.entry.mjs but relying on node_modules is safer for sharp.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Expose port
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# Start the Node.js server
CMD ["node", "./dist/server/entry.mjs"]
