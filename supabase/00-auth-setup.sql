-- Supabase Auth Setup for Organic OS
-- Run this in Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Email confirmation (disable for dev)
ALTER TABLE auth.users ALTER COLUMN email_confirmed_at SET DEFAULT NOW();

-- Set up JWT claims for the app
CREATE OR REPLACE FUNCTION public.jwt_token()
RETURNS TEXT AS $$
  SELECT
    (SELECT email FROM auth.users WHERE id = auth.uid())::TEXT
    || ',' ||
    (SELECT id FROM auth.users WHERE id = auth.uid())::TEXT
    || ',' ||
    (SELECT COALESCE((SELECT email FROM auth.users WHERE id = auth.uid()), ''))::TEXT
    || ',' ||
    (SELECT COALESCE((SELECT full_name FROM public.profiles WHERE id = auth.uid()), ''))::TEXT
    || ',' ||
    (SELECT COALESCE((SELECT avatar_url FROM public.profiles WHERE id = auth.uid()), ''))::TEXT
  AS token;
$$ LANGUAGE sql SECURITY DEFINER;

\echo 'Supabase Auth Setup Complete!'
\echo 'Next: Go to Authentication → Providers → Enable Email and Google OAuth'
