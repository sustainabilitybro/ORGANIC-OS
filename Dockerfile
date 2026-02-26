# Organic OS - Docker Configuration
# Multi-stage build for production

# ============ Backend ============
FROM python:3.11-slim as backend

WORKDIR /app

# Install dependencies
COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY apps/api/ .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# ============ Frontend ============
FROM node:20-alpine as frontend

WORKDIR /app

# Copy root package files for monorepo
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/*/package*.json ./packages/

# Install dependencies (use npm install for monorepo)
RUN npm install

# Copy application
COPY apps/web/ .
COPY packages/ ./packages/
COPY apps/api ./apps/api

# Build for production
RUN npm run build

# ============ Production ============
FROM nginx:alpine as production

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built frontend
COPY --from=frontend /app/apps/web/.next/static /usr/share/nginx/html/_next/static
COPY --from=frontend /app/apps/web/public /usr/share/nginx/html
COPY --from=frontend /app/apps/web/.next/server /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
