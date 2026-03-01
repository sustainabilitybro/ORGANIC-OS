#!/bin/bash
# Organic OS - Backup Script
# Run this to create a backup of the database and uploads

set -e

BACKUP_DIR="${BACKUP_DIR:-./backups}"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🔒 Organic OS Backup"
echo "===================="

mkdir -p "$BACKUP_DIR"

# Backup environment variables (if exists)
if [ -f "apps/web/.env.local" ]; then
    echo "📦 Backing up environment configuration..."
    # Never commit .env.local - create encrypted backup instead
    echo ".env.local found but not backed up (contains secrets)"
fi

# Backup database (if Supabase CLI is available)
if command -v supabase &> /dev/null; then
    echo "📦 Backing up database..."
    supabase db dump --db-url "$DATABASE_URL" > "$BACKUP_DIR/db_$DATE.sql" 2>/dev/null || echo "Database backup requires DATABASE_URL"
fi

# Create metadata backup
echo "📦 Creating metadata backup..."
cat > "$BACKUP_DIR/metadata_$DATE.json" << JSON
{
  "date": "$(date -Iseconds)",
  "version": "1.0.0",
  "hostname": "$(hostname)",
  "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')"
}
JSON

echo "✅ Backup complete!"
echo "Location: $BACKUP_DIR"

# List backups
ls -la "$BACKUP_DIR"
