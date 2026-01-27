# Build Stage
FROM oven/bun:1.1 as build

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install

# Copy source and build
COPY . .

# Set build-time env
ARG PUBLIC_STRAPI_URL
ENV PUBLIC_STRAPI_URL=${PUBLIC_STRAPI_URL}

RUN bun run build

# Runtime Stage
FROM node:20-slim

WORKDIR /app

# Install a simple static server
RUN npm install -g serve

# Copy build artifacts
COPY --from=build /app/dist ./dist

EXPOSE 4321

# Serve the static files
CMD ["serve", "-s", "dist", "-l", "4321"]
