-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.create_auth_events_table();

-- Create a function that can be called directly to create the auth events table
CREATE OR REPLACE FUNCTION public.create_auth_events_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  table_exists boolean;
BEGIN
  -- Check if table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_auth_events'
  ) INTO table_exists;

  -- Only create if it doesn't exist
  IF NOT table_exists THEN
    -- Create the table
    CREATE TABLE public.user_auth_events (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL,
      email TEXT NOT NULL,
      event_type TEXT NOT NULL CHECK (event_type IN ('login', 'signup')),
      source_slug TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Enable RLS
    ALTER TABLE public.user_auth_events ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can view their own auth events"
      ON public.user_auth_events
      FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own auth events"
      ON public.user_auth_events
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- Create indexes
    CREATE INDEX idx_user_auth_events_user_id ON public.user_auth_events(user_id);
    CREATE INDEX idx_user_auth_events_created_at ON public.user_auth_events(created_at DESC);

    RAISE NOTICE 'Table user_auth_events created successfully';
  ELSE
    RAISE NOTICE 'Table user_auth_events already exists';
  END IF;

  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating table: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_auth_events_table() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_auth_events_table() TO service_role; 