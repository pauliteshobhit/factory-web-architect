import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import AuthEventsTest from "./AuthEventsTest";
import AuthTableTest from "./AuthTableTest";
import AuthTestCases from "./AuthTestCases";

interface AuthEvent {
  id: string;
  user_id: string;
  email: string;
  event_type: "login" | "signup";
  source_slug: string | null;
  created_at: string;
}

const AuthEvents = () => {
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔍 Fetching auth events...");
      
      // First, check if we can access the table
      const { data: tableCheck, error: tableError } = await supabase
        .from("user_auth_events")
        .select("count")
        .limit(1);

      if (tableError) {
        console.error("❌ Table access error:", tableError);
        throw new Error(`Table access error: ${tableError.message}`);
      }

      console.log("✅ Table access successful");

      // Then fetch the actual events
      const { data, error } = await supabase
        .from("user_auth_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("❌ Fetch error:", error);
        throw error;
      }

      console.log("✅ Events fetched:", data?.length || 0);
      setEvents(data || []);
    } catch (err: any) {
      console.error("❌ Error in fetchEvents:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to load auth events: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔄 Component mounted, fetching events...");
    fetchEvents();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">🔐 Auth Testing & Events</h1>

      {/* Auth Test Suite */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Authentication Test Suite</h2>
        <AuthTestCases />
      </div>

      {/* Table Test Suite */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Table Operations Test</h2>
        <AuthTableTest />
      </div>

      {/* Events Test */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Events Test</h2>
        <AuthEventsTest />
      </div>

      {/* Debug Info */}
      <div className="bg-muted p-4 rounded-lg mb-6 text-sm">
        <p><strong>Status:</strong> {loading ? "Loading..." : error ? "Error" : "Ready"}</p>
        <p><strong>Events Count:</strong> {events.length}</p>
        {error && <p><strong>Error:</strong> {error}</p>}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          <p className="font-medium">Error loading events:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <p className="text-muted-foreground">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-muted-foreground">No auth events found.</p>
      ) : (
        <div className="space-y-4 mt-8">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{event.email}</span>
                  <Badge variant={event.event_type === "signup" ? "default" : "outline"}>
                    {event.event_type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>From:</strong> {event.source_slug || "unknown"} <br />
                  <strong>User ID:</strong> {event.user_id}
                </p>
                <p className="text-xs text-muted-foreground pt-2">
                  {new Date(event.created_at).toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthEvents; 