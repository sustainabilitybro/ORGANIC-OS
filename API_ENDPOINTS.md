# Organic OS API Endpoints

## GitHub Integration

| Endpoint | Description |
|----------|-------------|
| `/api/github` | Overview of all repos and user |
| `/api/github/repos` | List all repositories with details |
| `/api/github/repos/[repo]` | Get specific repo with commits and languages |
| `/api/github/languages` | Language statistics across all repos |
| `/api/github/contributors` | Contributors across all repos |
| `/api/github/issues` | Open issues across all repos |
| `/api/github/actions` | GitHub Actions workflow runs |
| `/api/github/events` | User events activity |
| `/api/github/pulls` | Pull requests across all repos |
| `/api/github/search` | Search code in repos |
| `/api/stats` | Comprehensive GitHub statistics |

## System

| Endpoint | Description |
|----------|-------------|
| `/api/health` | Health check |
| `/api/system` | System information |
| `/api/version` | API version |

## Data

| Endpoint | Description |
|----------|-------------|
| `/api/stats` | Portfolio statistics |
| `/api/analytics` | Analytics data |
| `/api/content` | Content management |

## Supabase

| Endpoint | Description |
|----------|-------------|
| `/api/supabase/profile` | User profile management |

## Other

| Endpoint | Description |
|----------|-------------|
| `/api/quote` | Random quotes |
| `/api/time` | Time information |
| `/api/weather` | Weather data |
| `/api/search` | Search functionality |

## Usage

### GitHub Stats
```bash
curl /api/stats
```

### Specific Repo
```bash
curl /api/github/repos/ORGANIC-OS
```

### Search
```bash
curl "/api/github/search?q=react"
```
