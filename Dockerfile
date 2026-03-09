# Organic OS - Docker Configuration
# Multi-stage build for optimized production images

# ============ Base ============
FROM python:3.12-slim as base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ============ Backend ============
FROM base as backend

WORKDIR /app

# Install Python dependencies
COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir --break-system-packages -r requirements.txt

# Copy application
COPY apps/api/ .

# Create non-root user for security
RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]

# ============ Frontend ============
FROM node:22-alpine as frontend

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/*/package*.json ./packages/ 2>/dev/null || true

# Install dependencies
RUN npm ci --prefer-offline

# Copy source code
COPY apps/web/ .
COPY packages/ ./packages/ 2>/dev/null || true
COPY apps/api ./apps/api

# Build for production
ENV NODE_ENV=production
RUN npm run build

# ============ Production ============
FROM nginx:alpine as production

# Install nginx and configure
RUN apk add --no-cache \
    nginx \
    curl

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built frontend from build stage
COPY --from=frontend --chown=nginx:nginx /app/apps/web/.next/static /usr/share/nginx/html/_next/static
COPY --from=frontend --chown=nginx:nginx /app/apps/web/public /usr/share/nginx/html

# Create nginx static files index
RUN touch /usr/share/nginx/html/_next/static/manifest.txt

EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
