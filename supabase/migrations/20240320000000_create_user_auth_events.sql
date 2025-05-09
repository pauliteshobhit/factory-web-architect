-- Create user_auth_events table
CREATE TABLE IF NOT EXISTS user_auth_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('login', 'signup')),
  source_slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE user_auth_events ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own events
CREATE POLICY "Users can view their own auth events"
  ON user_auth_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own events
CREATE POLICY "Users can insert their own auth events"
  ON user_auth_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_auth_events_user_id ON user_auth_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_auth_events_created_at ON user_auth_events(created_at DESC); 