# Organic OS Quick Reference

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

## Project Structure

```
ORGANIC-OS/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # FastAPI backend
│   └── supabase/     # Database schema
├── packages/          # Shared packages
├── config/           # Configuration
├── scripts/          # Automation scripts
└── docs/             # Documentation
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run linters |
| `npm test` | Run tests |

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional variables:
- `MINIMAX_API_KEY`
- `NEXT_PUBLIC_GA_ID`

## Deployment

### Vercel (Recommended)
1. Import project in Vercel
2. Add environment variables
3. Deploy

### Docker
```bash
./scripts/deploy.sh docker
```

## Modules

| Module | Route | Description |
|--------|-------|-------------|
| Identity | `/identity` | Values, purpose, legacy |
| Emotional | `/emotional` | EQ, coping strategies |
| Sensory | `/sensory` | 5 senses exercises |
| Wellness | `/wellness` | Health tracking |
| Recovery | `/recovery` | Burnout assessment |
| Communication | `/communication` | Public speaking |
| Video | `/video` | On-camera practice |
| Sustainability | `/sustainability` | Eco-living |
| GitHub | `/github` | Project dashboard |

## API Endpoints

- `/api/health` - Health check
- `/api/stats` - System stats
- `/api/config` - App config
- `/api/github` - GitHub overview
- `/api/github/repos` - Repository data
- `/api/github/issues` - Issues
- `/api/github/actions` - Workflows
- `/api/github/contributors` - Contributors
- `/api/github/languages` - Language stats

## Support

- GitHub Issues: https://github.com/sustainabilitybro/ORGANIC-OS/issues
- Documentation: See `*.md` files in root
