-- Create a function to create the auth events table
CREATE OR REPLACE FUNCTION create_auth_events_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS user_auth_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    email TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('login', 'signup')),
    source_slug TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );

  -- Enable RLS
  ALTER TABLE user_auth_events ENABLE ROW LEVEL SECURITY;

  -- Create policies if they don't exist
  DO $$
  BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own auth events" ON user_auth_events;
    DROP POLICY IF EXISTS "Users can insert their own auth events" ON user_auth_events;

    -- Create new policies
    CREATE POLICY "Users can view their own auth events"
      ON user_auth_events
      FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own auth events"
      ON user_auth_events
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END $$;

  -- Create indexes if they don't exist
  CREATE INDEX IF NOT EXISTS idx_user_auth_events_user_id ON user_auth_events(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_auth_events_created_at ON user_auth_events(created_at DESC);
END;
$$; 