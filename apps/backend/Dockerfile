# Multi-stage build for NestJS backend application
# Stage 1: Build the application
FROM docker.io/node:lts-alpine AS builder

WORKDIR /workspace

# Copy package files
COPY package*.json ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN npm ci

# Copy workspace configuration and source code
COPY nx.json tsconfig.base.json tsconfig.json eslint.config.mjs jest.preset.js jest.config.ts ./
COPY apps/backend ./apps/backend/

# Sync NX workspace and build the backend application
RUN npx nx sync --skip-nx-cache && npx nx build backend --prod

# Stage 2: Production runtime
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /workspace/apps/backend/dist ./

# Install production dependencies only
RUN npm --omit=dev -f install

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

EXPOSE 3000

CMD [ "node", "main.js" ]
