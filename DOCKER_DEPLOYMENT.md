# Organic OS - Docker Deployment

This guide covers deploying Organic OS using Docker.

## Quick Start

### Prerequisites
- Docker
- Docker Compose

### Development

```bash
# Clone and setup
git clone https://github.com/sustainabilitybro/ORGANIC-OS.git
cd ORGANIC-OS

# Create .env file
cp .env.example .env

# Start all services
docker-compose up -d
```

### Production

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Run production
docker-compose -f docker-compose.yml up -d
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| frontend | 3000 | Next.js web app (nginx) |
| backend | 8000 | FastAPI server |
| postgres | 5432 | PostgreSQL database |

## Environment Variables

Create `.env`:

```env
# Supabase (or local PostgreSQL)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# PostgreSQL (optional, for local development)
POSTGRES_PASSWORD=your-secure-password
```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose build --no-cache

# Run tests in container
docker-compose exec backend pytest
```

## Deployment to Cloud

### Render.com
1. Connect GitHub repository
2. Configure with Docker
3. Set environment variables

### Railway
1. Connect GitHub repository
2. Add PostgreSQL plugin
3. Deploy

### DigitalOcean App Platform
1. Connect GitHub repository
2. Choose Docker runtime
3. Configure environment variables
