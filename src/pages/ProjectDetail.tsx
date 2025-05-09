import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  slug: string;
  category: string;
  video_url?: string | null;
  created_at: string;
  created_by: string;
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [debugSlug, setDebugSlug] = useState(slug || '');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          toast({ title: "Project not found", description: slug, variant: "destructive" });
          console.error("❌ Project fetch error:", error || "No data");
          setProject(null);
          return;
        }

        setProject(data);
        console.log("✅ Project fetched:", data.title);
      } catch (err) {
        console.error("❌ Unexpected error fetching project:", err);
        toast({ title: "Unexpected error", description: String(err), variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug, toast]);

  // Debug mode toggle (hidden in production)
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  // Debug fetch function
  const handleDebugFetch = async () => {
    if (!debugSlug) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Debug: Fetching project with slug:', debugSlug);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', debugSlug)
        .single();

      console.log('📦 Debug: Fetch result:', { data, error });

      if (error) throw error;
      setProject(data);
    } catch (err) {
      console.error('❌ Debug: Error fetching project:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-8" /> {/* Back button */}
            <Skeleton className="h-12 w-48 mb-4" /> {/* Category */}
            <Skeleton className="h-16 w-3/4 mb-8" /> {/* Title */}
            <Skeleton className="aspect-video w-full mb-8" /> {/* Image */}
            <Skeleton className="h-32 w-full mb-8" /> {/* Description */}
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            {/* Debug Mode (hidden in production) */}
            {import.meta.env.DEV && (
              <div className="mt-8 p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleDebugMode}
                  >
                    {debugMode ? 'Hide Debug' : 'Show Debug'}
                  </Button>
                  {debugMode && (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={debugSlug}
                        onChange={(e) => setDebugSlug(e.target.value)}
                        placeholder="Enter project slug"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDebugFetch}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {debugMode && project && (
                  <pre className="mt-4 p-4 bg-muted rounded text-xs overflow-auto">
                    {JSON.stringify(project, null, 2)}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button 
                onClick={() => navigate('/projects')}
                className="min-w-[180px]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
              {!user && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="min-w-[180px]"
                >
                  Log In
                </Button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // If project not found, show 404
  if (!project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/projects')} className="min-w-[180px]">
            Back to Projects
          </Button>
        </div>
      </Layout>
    );
  }

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-8">
              Please log in or sign up to view this project's details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/login')}
                className="min-w-[180px]"
              >
                Log In
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/signup')}
                className="min-w-[180px]"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // If user is logged in, show project details
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/projects')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>

          {/* Project header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <span className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                {project.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {project.title}
            </h1>
          </div>

          {/* Project image */}
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src={project.image_url} 
              alt={project.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Project Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">{project.description}</p>
            
            {/* Video Section */}
            {project.video_url && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-2">🎥 Demo Video</h3>
                <YouTubeEmbed url={project.video_url} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 