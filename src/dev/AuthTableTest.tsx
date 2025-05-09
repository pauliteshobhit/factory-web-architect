import { useState, useEffect } from 'react';
import { supabase, createAuthEventsTable } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface TableStatus {
  exists: boolean;
  rowCount: number;
  lastError?: string;
}

const AuthTableTest = () => {
  const [tableStatus, setTableStatus] = useState<TableStatus>({ exists: false, rowCount: 0 });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createTable = async () => {
    setLoading(true);
    try {
      console.log('🔄 Starting table creation...');
      
      // First, check if the function exists
      const { data: functionCheck, error: functionError } = await supabase
        .rpc('create_auth_events_table');

      console.log('Function check result:', { functionCheck, functionError });

      if (functionError) {
        console.error('Function execution error:', functionError);
        throw functionError;
      }

      console.log('✅ Table creation function executed successfully');

      toast({
        title: 'Success',
        description: 'Auth events table created successfully',
      });

      // Refresh table status
      await checkTableStatus();
    } catch (error: any) {
      console.error('Error creating table:', error);
      toast({
        title: 'Error',
        description: `Failed to create table: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkTableStatus = async () => {
    setLoading(true);
    try {
      console.log('🔍 Checking table status...');
      
      // Check if table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('user_auth_events')
        .select('count', { count: 'exact', head: true });

      console.log('Table check result:', { tableCheck, tableError });

      if (tableError) {
        console.error('Table check error:', tableError);
        setTableStatus({
          exists: false,
          rowCount: 0,
          lastError: tableError.message
        });
        return;
      }

      // Get row count
      const { count, error: countError } = await supabase
        .from('user_auth_events')
        .select('*', { count: 'exact', head: true });

      console.log('Count result:', { count, countError });

      if (countError) {
        console.error('Count error:', countError);
        setTableStatus({
          exists: true,
          rowCount: 0,
          lastError: countError.message
        });
        return;
      }

      setTableStatus({
        exists: true,
        rowCount: count || 0
      });

      toast({
        title: 'Table Status Checked',
        description: `Table exists: ${true}, Row count: ${count || 0}`,
      });
    } catch (error: any) {
      console.error('Error checking table:', error);
      setTableStatus({
        exists: false,
        rowCount: 0,
        lastError: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const insertTestEvent = async () => {
    setLoading(true);
    try {
      console.log('📝 Inserting test event...');
      
      const testEvent = {
        user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
        email: `test+${Date.now()}@example.com`,
        event_type: 'signup',
        source_slug: 'test_suite'
      };

      console.log('Test event data:', testEvent);

      const { data, error } = await supabase
        .from('user_auth_events')
        .insert(testEvent)
        .select();

      console.log('Insert result:', { data, error });

      if (error) {
        console.error('Insert error:', error);
        toast({
          title: 'Error',
          description: `Failed to insert test event: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Test event inserted successfully',
      });

      // Refresh table status
      await checkTableStatus();
    } catch (error: any) {
      console.error('Error inserting test event:', error);
      toast({
        title: 'Error',
        description: `Failed to insert test event: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 Component mounted, checking table status...');
    checkTableStatus();
  }, []);

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Auth Table Test Suite</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p><strong>Table Status:</strong> {tableStatus.exists ? '✅ Exists' : '❌ Not Found'}</p>
          <p><strong>Row Count:</strong> {tableStatus.rowCount}</p>
          {tableStatus.lastError && (
            <p className="text-destructive"><strong>Error:</strong> {tableStatus.lastError}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={checkTableStatus}
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Checking...' : 'Check Table Status'}
          </Button>
          {!tableStatus.exists && (
            <Button
              onClick={createTable}
              disabled={loading}
              variant="default"
            >
              {loading ? 'Creating...' : 'Create Table'}
            </Button>
          )}
          {tableStatus.exists && (
            <Button
              onClick={insertTestEvent}
              disabled={loading}
            >
              {loading ? 'Inserting...' : 'Insert Test Event'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTableTest; 