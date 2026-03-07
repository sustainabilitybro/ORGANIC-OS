#!/bin/bash
# Organic OS Database Initialization Script
# Sets up Supabase database with schema and seed data

set -e

echo "🗄️ Organic OS Database Setup"
echo "=============================="

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Install it from: https://github.com/supabase/cli"
    exit 1
fi

echo "✅ Supabase CLI found"

# Check if logged in
echo ""
echo "🔐 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "Please login to Supabase:"
    supabase login
fi

# Link to project
echo ""
echo "🔗 Linking to Supabase project..."
supabase link --project-ref your-project-ref

# Push schema
echo ""
echo "📋 Pushing database schema..."
supabase db push

# Seed data (optional)
echo ""
echo "🌱 Seeding database with initial data? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    supabase db execute --file supabase/seed.sql
fi

echo ""
echo "=============================="
echo "✅ Database setup complete!"
echo "=============================="
