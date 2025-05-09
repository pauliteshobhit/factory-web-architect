import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Log environment status in development
if (import.meta.env.DEV) {
  console.log('Environment Check:')
  console.log('Mode:', import.meta.env.MODE)
  console.log('Base URL:', import.meta.env.BASE_URL)
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key length:', supabaseAnonKey.length)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Function to create the auth events table
export const createAuthEventsTable = async () => {
  try {
    console.log('🔄 Creating auth events table...');
    
    // First check if the table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('user_auth_events')
      .select('count', { count: 'exact', head: true });

    if (!tableError) {
      console.log('✅ Table already exists');
      return true;
    }

    // If table doesn't exist, create it
    const { data, error } = await supabase.rpc('create_auth_events_table');
    
    if (error) {
      console.error('❌ Error creating table:', error);
      throw error;
    }

    console.log('✅ Table created successfully:', data);
    return true;
  } catch (error: any) {
    console.error('❌ Error in createAuthEventsTable:', error);
    throw error;
  }
}