import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const SupabaseDebug = () => {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [envStatus, setEnvStatus] = useState({ url: "", key: "" });
  const [insertResult, setInsertResult] = useState<string | null>(null);
  const [selectData, setSelectData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSession = async () => {
      try {
        console.log('🔍 Loading session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session error:', error);
          setError(error.message);
          return;
        }

        console.log('✅ Session loaded:', data?.session);
        setSessionInfo(data?.session || null);
      } catch (err: any) {
        console.error('❌ Session load error:', err);
        setError(err.message);
      }
    };

    // Check environment variables
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    console.log('🔧 Environment Check:');
    console.log('URL:', url ? '✅ Present' : '❌ Missing');
    console.log('Key:', key ? '✅ Present' : '❌ Missing');

    setEnvStatus({
      url: url || "❌ Not loaded",
      key: key ? "✅ Loaded" : "❌ Missing",
    });

    loadSession();
  }, []);

  const runInsertTest = async () => {
    setLoading(true);
    setError(null);
    setInsertResult(null);

    try {
      const user = sessionInfo?.user;
      if (!user) {
        const errorMsg = "Please login to test inserts.";
        console.error('❌ Auth error:', errorMsg);
        toast({ 
          title: "❌ Not logged in", 
          description: errorMsg,
          variant: "destructive"
        });
        return;
      }

      const payload = {
        user_id: user.id,
        email: user.email,
        event_type: "login",
        source_slug: "debug_test",
      };

      console.log("🚀 Insert Payload:", payload);

      const { data, error } = await supabase
        .from("user_auth_events")
        .insert(payload)
        .select();

      if (error) {
        console.error("❌ Insert Error:", error);
        setInsertResult("❌ Insert Failed");
        setError(error.message);
        toast({
          title: "❌ Insert Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log("✅ Insert Success:", data);
        setInsertResult("✅ Insert Successful");
        toast({ 
          title: "✅ Insert Successful",
          description: "Test event created successfully"
        });
      }
    } catch (err: any) {
      console.error("❌ Unexpected error:", err);
      setError(err.message);
      toast({
        title: "❌ Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runSelectTest = async () => {
    setLoading(true);
    setError(null);
    setSelectData([]);

    try {
      console.log("🔍 Fetching events...");
      const { data, error } = await supabase
        .from("user_auth_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("❌ Select Error:", error);
        setError(error.message);
        toast({
          title: "❌ Query Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log("✅ Retrieved Events:", data);
        setSelectData(data || []);
        toast({
          title: "✅ Query Successful",
          description: `Retrieved ${data?.length || 0} events`
        });
      }
    } catch (err: any) {
      console.error("❌ Unexpected error:", err);
      setError(err.message);
      toast({
        title: "❌ Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h2 className="text-2xl font-bold">🧪 Supabase Debug Panel</h2>

      <Card>
        <CardContent className="p-6 space-y-2 text-sm">
          <p><strong>Env URL:</strong> {envStatus.url}</p>
          <p><strong>Anon Key:</strong> {envStatus.key}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-2 text-sm">
          <p><strong>Session:</strong> {sessionInfo?.user?.email || "❌ Not Logged In"}</p>
          <p><strong>User ID:</strong> {sessionInfo?.user?.id || "—"}</p>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button 
          onClick={runInsertTest}
          disabled={loading || !sessionInfo?.user}
        >
          {loading ? "⏳ Processing..." : "🧪 Insert Test Event"}
        </Button>
        <Button 
          variant="outline" 
          onClick={runSelectTest}
          disabled={loading}
        >
          {loading ? "⏳ Loading..." : "📄 Load Latest Events"}
        </Button>
      </div>

      {insertResult && (
        <div className="text-sm font-medium">{insertResult}</div>
      )}

      {error && (
        <div className="text-red-500 text-sm p-4 bg-red-50 rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}

      {selectData.length > 0 && (
        <div className="pt-4 space-y-3">
          <h3 className="font-medium">Latest Events:</h3>
          {selectData.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 text-xs">
                <p><strong>Email:</strong> {item.email}</p>
                <p><strong>Type:</strong> {item.event_type}</p>
                <p><strong>Source:</strong> {item.source_slug}</p>
                <p><strong>Time:</strong> {new Date(item.created_at).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupabaseDebug; 