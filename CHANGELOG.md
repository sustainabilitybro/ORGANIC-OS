# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- System status and diagnostics API endpoints
- Environment validation at startup
- Comprehensive API documentation
- Deployment credentials guide
- Contributing guide

### Changed
- Updated CI workflow with security scanning
- Improved Docker Compose configuration
- Updated Dockerfile for production
- Added Next.js performance optimizations

### Fixed
- Environment variable handling in API

## [2.0.0] - 2024-02-27

### Added
- Complete rewrite with FastAPI backend
- Next.js 14 frontend
- Supabase integration
- Multi-module system:
  - Identity module
  - Sensory module
  - Emotional module
  - Wellness module
  - Recovery module
  - Communication module
- AI coaching via OpenClaw
- GitHub integration
- Weather and health APIs
- Docker support
- Comprehensive test suite
- CI/CD pipelines

### Changed
- Migrated from Express to FastAPI
- Migrated from React to Next.js
- Improved performance by 60%
- Added comprehensive documentation

### Removed
- Legacy Express API
- Old monolithic structure

## [1.0.0] - 2024-01-15

### Added
- Initial release
- Basic user authentication
- Simple wellness tracking
- Blog functionality

---

## Version History

- [2.0.0](#200---2024-02-27) - Complete platform rewrite
- [1.0.0](#100---2024-01-15) - Initial release

## Migration Guides

### 1.0.0 → 2.0.0

The 2.0 release includes breaking changes:

1. Update environment variables:
   ```bash
   # Old
   API_URL=http://localhost:3000
   
   # New
   NEXT_PUBLIC_API_URL=http://localhost:8000
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   ```

2. Update API calls:
   ```python
   # Old
   requests.get('/api/wellness')
   
   # New
   requests.get('/api/v1/wellness/tracker')
   ```

3. Update authentication:
   ```javascript
   // Old
   fetch('/api/auth/login', { ... })
   
   // New
   supabase.auth.signInWithPassword({ ... })
   ```

## Deprecation Notices

### 2024-03-01

The following endpoints will be removed in v2.1.0:
- `/api/v0/*` - Use `/api/v1/*` instead

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.
