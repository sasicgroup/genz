# Multi-stage build for GenZ AI Agents
FROM node:18-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force
RUN cd client && npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder

# Copy source code
COPY . .

# Build frontend
RUN cd client && npm run build

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S genz -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=genz:nodejs /app/client/build ./client/build
COPY --from=builder --chown=genz:nodejs /app/server.js ./
COPY --from=builder --chown=genz:nodejs /app/package*.json ./
COPY --from=builder --chown=genz:nodejs /app/node_modules ./node_modules

# Create necessary directories
RUN mkdir -p uploads logs && chown -R genz:nodejs uploads logs

# Switch to non-root user
USER genz

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["node", "server.js"]