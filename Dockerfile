FROM node:22 AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_BE_SCHEMA=http
ENV NEXT_PUBLIC_BE_HOST=devops_be
ENV NEXT_PUBLIC_BE_PORT=3001

# Bundle app source and build
COPY . .
RUN npm run build

# Production stage
FROM node:22-slim AS runner
WORKDIR /usr/src/app

# Copy built application
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
