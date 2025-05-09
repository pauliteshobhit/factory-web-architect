import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const dummyProjects = [
  {
    id: 1,
    title: "AI Image Generator",
    description: "Create stunning AI-generated artwork with just a text prompt",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    slug: "ai-image-generator",
    category: "Image AI"
  },
  {
    id: 2,
    title: "Smart Dashboard",
    description: "Data visualization dashboard with React and real-time updates",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    slug: "smart-dashboard",
    category: "Analytics"
  },
  {
    id: 3,
    title: "ChatBot Interface",
    description: "Modern conversational UI with natural language processing",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    slug: "chatbot-interface",
    category: "NLP"
  }
];

const ProjectClickTest = () => {
  const { user } = useAuth();
  const [logStatus, setLogStatus] = useState<string>("");
  const [recentClicks, setRecentClicks] = useState<any[]>([]);
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean;
    supabaseKey: boolean;
    tableExists: boolean;
  }>({
    supabaseUrl: false,
    supabaseKey: false,
    tableExists: false
  });

  useEffect(() => {
    checkEnvironment();
  }, []);

  const checkEnvironment = async () => {
    // Check environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    setEnvStatus(prev => ({
      ...prev,
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey
    }));

    // Check if table exists
    try {
      const { error } = await supabase
        .from('project_clicks')
        .select('count')
        .limit(1);

      setEnvStatus(prev => ({
        ...prev,
        tableExists: !error
      }));
    } catch (err) {
      console.error('Error checking table:', err);
    }
  };

  const testClick = async (projectSlug: string) => {
    if (!user) {
      setLogStatus("❌ No user session: cannot log project click");
      return;
    }

    try {
      const { error, data } = await supabase
        .from('project_clicks')
        .insert({
          user_id: user.id,
          project_slug: projectSlug,
          clicked_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error("Logging failed", error);
        setLogStatus(`❌ Failed to insert: ${error.message}`);
      } else {
        setLogStatus(`✅ Click logged for slug: ${projectSlug}`);
        console.log("Inserted record:", data);
        fetchRecentClicks();
      }
    } catch (err) {
      console.error("Error in test click:", err);
      setLogStatus(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const fetchRecentClicks = async () => {
    try {
      const { data, error } = await supabase
        .from('project_clicks')
        .select('*')
        .order('clicked_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Failed to fetch recent clicks:", error);
      } else {
        setRecentClicks(data || []);
      }
    } catch (err) {
      console.error("Error fetching recent clicks:", err);
    }
  };

  useEffect(() => {
    fetchRecentClicks();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>🧪 Project Click Test Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Environment Status */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Environment Status:</h3>
              <div className="grid gap-2">
                <Alert variant={envStatus.supabaseUrl ? "default" : "destructive"}>
                  {envStatus.supabaseUrl ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>Supabase URL</AlertTitle>
                  <AlertDescription>
                    {envStatus.supabaseUrl ? "Configured" : "Missing VITE_SUPABASE_URL"}
                  </AlertDescription>
                </Alert>
                <Alert variant={envStatus.supabaseKey ? "default" : "destructive"}>
                  {envStatus.supabaseKey ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>Supabase Key</AlertTitle>
                  <AlertDescription>
                    {envStatus.supabaseKey ? "Configured" : "Missing VITE_SUPABASE_ANON_KEY"}
                  </AlertDescription>
                </Alert>
                <Alert variant={envStatus.tableExists ? "default" : "destructive"}>
                  {envStatus.tableExists ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>Project Clicks Table</AlertTitle>
                  <AlertDescription>
                    {envStatus.tableExists ? "Table exists" : "Table not found"}
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            {/* Test Buttons */}
            <div className="flex flex-wrap gap-4">
              {dummyProjects.map((project) => (
                <Button
                  key={project.slug}
                  onClick={() => testClick(project.slug)}
                  variant="outline"
                  disabled={!envStatus.tableExists}
                >
                  Test Click: {project.title}
                </Button>
              ))}
            </div>

            {/* Status Display */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Status:</h3>
              <pre className="bg-secondary p-4 rounded text-sm overflow-auto">
                {logStatus || "No action taken yet"}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Clicks Display */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Project Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentClicks.length > 0 ? (
              recentClicks.map((click) => (
                <div
                  key={click.id}
                  className="flex justify-between items-center p-4 bg-secondary rounded-lg"
                >
                  <div>
                    <p className="font-medium">Project: {click.project_slug}</p>
                    <p className="text-sm text-muted-foreground">
                      Clicked at: {new Date(click.clicked_at).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    User ID: {click.user_id}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No recent clicks</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectClickTest; 