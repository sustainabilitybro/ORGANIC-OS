# Local Development Guide

This guide covers setting up Organic OS for local development.

## Prerequisites

- Node.js 20+ (use nvm for version management)
- Python 3.11+ 
- Docker (for local database)
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sustainabilitybro/ORGANIC-OS.git
cd ORGANIC-OS
```

### 2. Run Full Setup Script

```bash
# This will install all dependencies and set up environment files
bash scripts/setup-full.sh
```

Or manually:

```bash
# Install root dependencies
npm install

# Install web dependencies
cd apps/web && npm install && cd ../..

# Install API dependencies
cd apps/api && pip install -r requirements.txt && cd ../..
```

### 3. Set Up Database

#### Option A: Use Existing PostgreSQL Container

The project can use an existing `remedies-db-postgres` container:

```bash
# Connect to the container
docker exec -it remedies-db-postgres psql -U remedies_user -d remedies_db

# Create database
CREATE DATABASE organic_os;
```

Then create the tables using the schema in `supabase/migrations/001_initial_schema.sql`.

#### Option B: Local Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Access local dashboard at http://localhost:54321
```

#### Option C: Docker Compose

```bash
# Start all services
docker-compose up -d

# This starts:
# - PostgreSQL database
# - API (FastAPI)
# - Web (Next.js)
```

### 4. Environment Variables

Create environment files:

```bash
# For web app
cp apps/web/.env.example apps/web/.env.local

# For API
cp apps/api/.env.example apps/api/.env
```

Edit the files with your credentials:

```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000

# apps/api/.env
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
ENVIRONMENT=development
SECRET_KEY=dev-secret-key-change-in-production
```

### 5. Run Development Servers

#### Option A: Individual Services

```bash
# Terminal 1: Frontend (Next.js)
cd apps/web
npm run dev
# Access at http://localhost:3000

# Terminal 2: Backend (FastAPI)
cd apps/api
python3 -m uvicorn main:app --reload --port 8000
# API docs at http://localhost:8000/docs
```

#### Option B: Docker Compose

```bash
docker-compose up
```

## Project Structure

```
ORGANIC-OS/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # FastAPI backend
│   └── supabase/     # Database migrations
├── packages/         # Shared packages
├── scripts/          # Automation scripts
├── .github/
│   └── workflows/   # CI/CD pipelines
└── docs/            # Documentation
```

## Testing

```bash
# Frontend tests
cd apps/web
npm run test          # Watch mode
npm run test:run     # Single run
npm run test:coverage # With coverage

# Backend tests
cd apps/api
pytest -v

# Run all tests
npm run test:all
```

## Linting & Type Checking

```bash
# Lint
cd apps/web && npm run lint

# TypeScript check
cd apps/web && npx tsc --noEmit

# Python linting
cd apps/api
flake8 .
black --check .
isort --check .
```

## Building for Production

```bash
# Build all apps
npm run build

# Build specific app
cd apps/web && npm run build
cd apps/api && python3 -m compileall .
```

## Deployment

### Vercel (Frontend)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL`
3. Deploy automatically on push to main

### Supabase (Database)
1. Create Supabase project at supabase.com
2. Get project URL and anon key from Settings > API
3. Run migrations:
   ```bash
   supabase link --project-ref your-project-ref
   supabase db push
   ```

### Manual Deploy

```bash
# Build and deploy frontend
cd apps/web
npm run build
npx vercel --prod

# Deploy API
cd apps/api
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Troubleshooting

### Database Connection Issues
- Check PostgreSQL container is running: `docker ps`
- Verify credentials in `.env.local`
- Test connection: `psql $DATABASE_URL`

### Port Conflicts
- Next.js default: 3000
- FastAPI default: 8000
- Supabase default: 54321

### Common Errors

```bash
# "Module not found"
rm -rf node_modules package-lock.json
npm install

# "Database connection refused"
docker start remedies-db-postgres

# "Permission denied" on scripts
chmod +x scripts/*.sh
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Next Steps

1. Set up your Supabase project and add credentials
2. Configure authentication providers
3. Explore the module system
4. Customize the UI theme

## Getting Help

- GitHub Issues: https://github.com/sustainabilitybro/ORGANIC-OS/issues
- Documentation: https://github.com/sustainabilitybro/ORGANIC-OS#readme
