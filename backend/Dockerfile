# Build Stage
FROM oven/bun:1.1 as build

# Set node env
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json bun.lock ./
RUN bun install --production

WORKDIR /opt/app
COPY . .
RUN bun run build

# Production Stage
FROM oven/bun:1.1

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules

WORKDIR /opt/app
COPY --from=build /opt/app ./
ENV PATH /opt/node_modules/.bin:$PATH

RUN chown -R bun:bun /opt/app
USER bun

EXPOSE 1337

CMD ["bun", "run", "start"]
