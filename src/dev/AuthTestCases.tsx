import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const AuthTestCases = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const runTest = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: `test+${Date.now()}@example.com`,
        password: 'Test@123456',
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Test completed successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auth Test Suite</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={runTest}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Running Test...' : 'Run Test'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthTestCases; 