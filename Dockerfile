# ────────────────────────────────────────────────────
# Stage 1 — Builder
# ────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ────────────────────────────────────────────────────
# Stage 2 — Runtime
# ────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

# tini as PID 1 for proper signal handling and zombie reaping in ECS
RUN apk add --no-cache tini

# Run as non-root user (required for ECS security best practices)
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

USER nodejs

EXPOSE 3000

# ECS health check — liveness probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Use tini as entrypoint so SIGTERM reaches Node (not swallowed by npm/sh)
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/src/main.js"]
