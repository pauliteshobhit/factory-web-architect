import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuthEventsTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateTestEvent = async (eventType: "login" | "signup") => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Generating ${eventType} event...`);
      
      const testEmail = `test+${Date.now()}@example.com`;
      const testUserId = `test-user-${Date.now()}`;
      const testSource = eventType === "signup" ? "test_signup" : "test_login";

      console.log("📝 Test data:", { testEmail, testUserId, testSource });

      const { data, error } = await supabase.from("user_auth_events").insert({
        user_id: testUserId,
        email: testEmail,
        event_type: eventType,
        source_slug: testSource,
      }).select();

      if (error) {
        console.error("❌ Insert error:", error);
        throw error;
      }

      console.log("✅ Event created:", data);

      toast({
        title: "Success",
        description: `Test ${eventType} event created successfully`,
      });
    } catch (error: any) {
      console.error("❌ Error in generateTestEvent:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Generate Test Auth Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
        <div className="flex gap-4">
          <Button
            onClick={() => generateTestEvent("signup")}
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Generating..." : "Generate Signup Event"}
          </Button>
          <Button
            onClick={() => generateTestEvent("login")}
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            {loading ? "Generating..." : "Generate Login Event"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthEventsTest; 