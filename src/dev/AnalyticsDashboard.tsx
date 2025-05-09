import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, RefreshCw } from "lucide-react";

interface SummaryStats {
  total_signups: number;
  total_logins: number;
  total_clicks: number;
}

interface TopProject {
  project_title: string;
  click_count: number;
}

interface SignupSource {
  source_slug: string;
  count: number;
}

interface AuthEvent {
  id: string;
  email: string;
  event_type: 'login' | 'signup';
  source_slug: string;
  created_at: string;
}

interface ClickEvent {
  id: string;
  project_title: string;
  user_email: string;
  source_slug: string;
  created_at: string;
}

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [topProjects, setTopProjects] = useState<TopProject[]>([]);
  const [signupSources, setSignupSources] = useState<SignupSource[]>([]);
  const [recentAuthEvents, setRecentAuthEvents] = useState<AuthEvent[]>([]);
  const [recentClicks, setRecentClicks] = useState<ClickEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<'all' | 'signup' | 'login'>('all');
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching analytics data...');

      const [
        { data: authStats, error: authError },
        { data: clicksStats, error: clicksError },
        { data: topProjects, error: projectsError },
        { data: sources, error: sourcesError },
        { data: recentAuth, error: recentAuthError },
        { data: recentClicks, error: recentClicksError }
      ] = await Promise.all([
        supabase.rpc("get_auth_summary"),
        supabase.rpc("get_click_summary"),
        supabase.rpc("get_top_clicked_projects"),
        supabase.rpc("get_common_signup_sources"),
        supabase.from("user_auth_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("project_clicks")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10)
      ]);

      // Check for errors
      const errors = [authError, clicksError, projectsError, sourcesError, recentAuthError, recentClicksError]
        .filter(Boolean);
      
      if (errors.length > 0) {
        console.error('❌ Analytics errors:', errors);
        throw new Error(errors[0]?.message || 'Failed to fetch analytics data');
      }

      console.log('✅ Analytics data fetched successfully');
      
      setSummary({ ...authStats, ...clicksStats });
      setTopProjects(topProjects || []);
      setSignupSources(sources || []);
      setRecentAuthEvents(recentAuth || []);
      setRecentClicks(recentClicks || []);

      toast({
        title: "✅ Analytics Updated",
        description: "Dashboard data refreshed successfully",
      });
    } catch (err: any) {
      console.error('❌ Analytics error:', err);
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

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const exportToCSV = () => {
    try {
      // Combine auth events and clicks
      const allEvents = [
        ...recentAuthEvents.map(event => ({
          type: 'auth',
          event_type: event.event_type,
          project: '',
          email: event.email,
          source: event.source_slug,
          timestamp: event.created_at
        })),
        ...recentClicks.map(event => ({
          type: 'click',
          event_type: '',
          project: event.project_title,
          email: event.user_email,
          source: event.source_slug,
          timestamp: event.created_at
        }))
      ];

      // Convert to CSV
      const headers = ['Type', 'Event Type', 'Project', 'Email', 'Source', 'Timestamp'];
      const csvContent = [
        headers.join(','),
        ...allEvents.map(event => [
          event.type,
          event.event_type,
          event.project,
          event.email,
          event.source,
          event.timestamp
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `analytics-export-${new Date().toISOString()}.csv`;
      link.click();

      toast({
        title: "✅ Export Successful",
        description: "Analytics data exported to CSV",
      });
    } catch (err: any) {
      console.error('❌ Export error:', err);
      toast({
        title: "❌ Export Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const filteredAuthEvents = eventFilter === 'all' 
    ? recentAuthEvents 
    : recentAuthEvents.filter(event => event.event_type === eventFilter);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">📊 Analytics Dashboard</h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={fetchAnalytics}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={loading}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
            <Badge variant="secondary">{summary?.total_signups || 0}</Badge>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <Badge variant="secondary">{summary?.total_logins || 0}</Badge>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Project Clicks</CardTitle>
            <Badge variant="secondary">{summary?.total_clicks || 0}</Badge>
          </CardHeader>
        </Card>
      </div>

      {/* Top Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Clicked Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProjects.map((project, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{project.project_title}</span>
                  <Badge>{project.click_count} clicks</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Signup Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {signupSources.map((source, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{source.source_slug}</span>
                  <Badge>{source.count} signups</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Activity</CardTitle>
            <Tabs value={eventFilter} onValueChange={(v) => setEventFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="signup">Signups</TabsTrigger>
                <TabsTrigger value="login">Logins</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAuthEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{event.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.event_type} via {event.source_slug}
                  </p>
                </div>
                <Badge variant="outline">
                  {new Date(event.created_at).toLocaleString()}
                </Badge>
              </div>
            ))}

            {recentClicks.map((click) => (
              <div key={click.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{click.project_title}</p>
                  <p className="text-sm text-muted-foreground">
                    Clicked by {click.user_email} via {click.source_slug}
                  </p>
                </div>
                <Badge variant="outline">
                  {new Date(click.created_at).toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard; 