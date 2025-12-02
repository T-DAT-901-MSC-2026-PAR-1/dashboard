# Multi-stage build for React/Vite application
# Stage 1: Build the application
FROM docker.io/node:lts-alpine AS builder

WORKDIR /workspace

# Copy package files
COPY package*.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY libs/shared/package.json ./libs/shared/

# Install dependencies
RUN npm ci

# Copy workspace configuration and source code
COPY nx.json tsconfig.base.json tsconfig.json eslint.config.mjs jest.preset.js jest.config.ts vitest.workspace.ts ./
COPY apps/frontend ./apps/frontend/
COPY libs/shared ./libs/shared/

# Sync NX workspace and build the frontend application
RUN npx nx sync --skip-nx-cache && npx nx build frontend --prod

# Stage 2: Serve with Nginx
FROM docker.io/nginx:alpine

# Copy built files from builder stage
COPY --from=builder /workspace/apps/frontend/dist /usr/share/nginx/html

# Copy custom nginx configuration if needed
# COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
