FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the app with environment variables from docker-compose
# These will be available during build time
ARG NEXT_PUBLIC_BE_SCHEMA
ARG NEXT_PUBLIC_BE_HOST
ARG NEXT_PUBLIC_BE_PORT

ENV NEXT_PUBLIC_BE_SCHEMA=$NEXT_PUBLIC_BE_SCHEMA
ENV NEXT_PUBLIC_BE_HOST=$NEXT_PUBLIC_BE_HOST
ENV NEXT_PUBLIC_BE_PORT=$NEXT_PUBLIC_BE_PORT
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Default port (can be overridden by docker-compose)
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
