# Multi-stage build for NestJS backend application
# Stage 1: Build the application
FROM docker.io/node:lts-alpine AS builder

WORKDIR /workspace

# Copy package files
COPY package*.json ./
COPY apps/backend/package.json ./apps/backend/
COPY libs/shared/package.json ./libs/shared/

# Install dependencies
RUN npm ci

# Copy workspace configuration and source code
COPY nx.json tsconfig.base.json tsconfig.json eslint.config.mjs jest.preset.js jest.config.ts ./
COPY libs/shared ./libs/shared/
COPY apps/backend ./apps/backend/

# Sync NX workspace and build the backend application with pruning
RUN npx nx sync --skip-nx-cache && npx nx run backend:prune

# Stage 2: Production runtime
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

WORKDIR /app

# Copy built files including workspace_modules from builder stage
COPY --from=builder /workspace/apps/backend/dist/package.json /workspace/apps/backend/dist/package-lock.json ./
COPY --from=builder /workspace/apps/backend/dist/workspace_modules ./workspace_modules
COPY --from=builder /workspace/apps/backend/dist/*.js ./

# Install production dependencies (including workspace_modules)
RUN npm --omit=dev ci

# Copy assets if they exist
RUN --mount=type=bind,from=builder,source=/workspace/apps/backend/dist,target=/tmp/dist \
    if [ -d /tmp/dist/assets ]; then cp -r /tmp/dist/assets ./assets; fi

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

EXPOSE 3000

CMD [ "node", "main.js" ]
