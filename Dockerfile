FROM node:22 AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source and build
COPY . .
RUN npm run build

# Production stage
FROM node:22-slim AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
