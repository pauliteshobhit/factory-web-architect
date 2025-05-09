-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.user_auth_events CASCADE;
DROP TABLE IF EXISTS public.project_clicks CASCADE;

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.user_auth_events;
DROP POLICY IF EXISTS "Allow select own" ON public.user_auth_events;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON public.project_clicks;
DROP POLICY IF EXISTS "Allow select own" ON public.project_clicks;

-- Drop existing indexes
DROP INDEX IF EXISTS idx_user_auth_events_user_id;
DROP INDEX IF EXISTS idx_user_auth_events_created_at;
DROP INDEX IF EXISTS idx_project_clicks_user_id;
DROP INDEX IF EXISTS idx_project_clicks_created_at;

-- Create or replace user_auth_events table
CREATE TABLE IF NOT EXISTS public.user_auth_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('signup', 'login')),
  source_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT current_timestamp
);

-- Enable RLS
ALTER TABLE public.user_auth_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_auth_events
CREATE POLICY "Allow insert for authenticated"
ON public.user_auth_events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow select own"
ON public.user_auth_events
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create or replace project_clicks table
CREATE TABLE IF NOT EXISTS public.project_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  user_email TEXT NOT NULL,
  source_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT current_timestamp
);

-- Enable RLS
ALTER TABLE public.project_clicks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_clicks
CREATE POLICY "Allow insert for authenticated"
ON public.project_clicks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow select own"
ON public.project_clicks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_auth_events_user_id') THEN
    CREATE INDEX idx_user_auth_events_user_id ON public.user_auth_events(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_auth_events_created_at') THEN
    CREATE INDEX idx_user_auth_events_created_at ON public.user_auth_events(created_at DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_project_clicks_user_id') THEN
    CREATE INDEX idx_project_clicks_user_id ON public.project_clicks(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_project_clicks_created_at') THEN
    CREATE INDEX idx_project_clicks_created_at ON public.project_clicks(created_at DESC);
  END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON public.user_auth_events TO authenticated;
GRANT ALL ON public.project_clicks TO authenticated; 