# Organic OS

A comprehensive personal operating system for sustainable living, identity development, and holistic wellness. Built with Next.js, FastAPI, and Supabase.

![Build Status](https://github.com/sustainabilitybro/ORGANIC-OS/actions/workflows/main.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## Features

### Core Modules
- **Identity** - Discover your authentic self through values and purpose
- **Sensory** - Explore and optimize your senses
- **Emotional** - Master emotional intelligence
- **Wellness** - Holistic health tracking and natural remedies
- **Recovery** - Burnout prevention and stress management
- **Communication** - Public speaking and expression mastery
- **Sustainability** - Carbon footprint and eco-living tools
- **Video** - Practice and create on camera

### Specialized Tools
- **Atom Economy** - Green chemistry calculations for sustainable processes
- **Holistic Alchemy** - Transformation framework integrating psychology, habits, and development

### API Endpoints
- AI-powered search, weather, crypto prices
- User progress tracking
- Database health monitoring

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python), SQLite |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel (Frontend), Render/Railway (API) |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/sustainabilitybro/ORGANIC-OS.git
cd ORGANIC-OS

# Install dependencies
npm install

# Set up environment
cp apps/web/.env.example apps/web/.env.local

# Run development server
npm run dev
```

## Project Structure

```
ORGANIC-OS/
├── apps/
│   ├── web/           # Next.js frontend
│   ├── api/           # FastAPI backend
│   └── supabase/      # Database schema
├── packages/          # Shared packages
├── scripts/          # Deployment scripts
└── docs/             # Documentation
```

## Deployment

### Frontend (Vercel)
```bash
cd apps/web
vercel --prod
```

### Backend (Render/Railway)
```bash
cd apps/api
# Deploy via GitHub integration
```

### Database (Supabase)
```bash
supabase db push
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Related Repositories

- [atom-economy](https://github.com/sustainabilitybro/atom-economy) - Green chemistry calculator
- [Holistic-Alchemy](https://github.com/sustainabilitybro/Holistic-Alchemy) - Transformation framework
