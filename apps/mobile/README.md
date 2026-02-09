# Organic OS Mobile App

React Native companion app for Organic OS.

## Quick Start

```bash
cd apps/mobile

# Install dependencies
npm install

# Start development server
npm run dev

# Run on iOS
npm run start -- --ios

# Build for production
expo build
```

## Features

- Dashboard with module overview
- Quick wellness logging
- Daily prompts and reflections
- Progress tracking
- Push notifications

## Tech Stack

- React Native 0.74
- Expo 51
- React Navigation 6
- Supabase for data sync

## Screens

1. **Home** - Module grid, quick stats, daily prompt
2. **Wellness** - Daily logging (sleep, mood, energy, water)
3. **Profile** - Stats, settings, data export

## Notes

- Currently uses mock data - connect to Supabase for real data
- Push notifications require OneSignal integration
- App structure ready for full Supabase integration
