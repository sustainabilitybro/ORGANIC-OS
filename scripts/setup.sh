#!/bin/bash
# Organic OS Setup Script
# This script helps set up the development environment

set -e

echo "🌿 Setting up Organic OS Development Environment"
echo "=================================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local from template..."
    cp apps/web/.env.example apps/web/.env.local
    echo "✅ Please edit apps/web/.env.local with your Supabase credentials"
fi

# Build the project
echo ""
echo "🔨 Building the project..."
npm run build

echo ""
echo "=================================================="
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "To start the production server:"
echo "  npm start"
echo "=================================================="
