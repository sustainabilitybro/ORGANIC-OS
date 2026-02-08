#!/bin/bash
# Organic OS - Supabase Setup Script
# Run this to initialize your Supabase project

set -e

echo "🌱 Setting up Supabase for Organic OS..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

# Create Supabase project (requires authentication)
echo "🔐 Make sure you're logged in: supabase login"
echo ""
echo "To create a new Supabase project:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Create a new project"
echo "3. Get your project URL and anon key"
echo "4. Run: supabase link --project-id YOUR_PROJECT_ID"
echo ""

# Link to existing project (if you have one)
read -p "Enter your Supabase project ID (or press Enter to skip linking): " PROJECT_ID

if [ -n "$PROJECT_ID" ]; then
    echo "🔗 Linking to Supabase project..."
    supabase link --project-id "$PROJECT_ID"
    
    echo "📤 Pushing schema to database..."
    supabase db push
    
    echo "✅ Database schema deployed!"
else
    echo "⏭️  Skipping database link."
    echo ""
    echo "To deploy schema later, run:"
    echo "  supabase link --project-id YOUR_PROJECT_ID"
    echo "  supabase db push"
fi

echo ""
echo "🌱 Supabase setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env"
echo "2. Add your SUPABASE_URL and SUPABASE_ANON_KEY"
echo "3. Run: npm run db:generate"
