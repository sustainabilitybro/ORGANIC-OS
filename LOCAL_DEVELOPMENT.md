# Local Development Guide

This guide covers setting up Organic OS for local development.

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker (for local database)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sustainabilitybro/ORGANIC-OS.git
cd ORGANIC-OS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

#### Option A: Use Existing PostgreSQL Container

The project can use the existing `remedies-db-postgres` container:

```bash
# Connect to the container
docker exec -it remedies-db-postgres psql -U remedies_user -d remedies_db

# Create database
CREATE DATABASE organic_os;
```

#### Option B: Local Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start
```

### 4. Environment Variables

Create a `.env.local` file:

```bash
# Database (using Docker container)
DATABASE_URL=postgresql://remedies_user:your_secure_password_here@localhost:5432/organic_os

# Application
ENVIRONMENT=development
SECRET_KEY=dev-secret-key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 5. Run Development Servers

```bash
# Frontend (Next.js)
npm run dev

# Backend (FastAPI) - in separate terminal
cd apps/api
python3 -m uvicorn main:app --reload --port 8000
```

## Database Schema

Run the following SQL to create the core tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    timezone TEXT DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- See supabase/migrations/001_initial_schema.sql for complete schema
```

## Testing

```bash
# Lint
npm run lint

# Build
npm run build
```

## Deployment

### Vercel (Frontend)
1. Connect GitHub repository to Vercel
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

### Supabase (Database)
1. Create Supabase project
2. Run migrations: `supabase db push`
3. Get API credentials

## Troubleshooting

### Database Connection Issues
- Check PostgreSQL container is running: `docker ps`
- Verify credentials in `.env.local`
- Test connection: `psql $DATABASE_URL`

### Port Conflicts
- Next.js default: 3000
- FastAPI default: 8000

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
