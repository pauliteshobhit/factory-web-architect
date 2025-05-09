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
import { AlertCircle } from "lucide-react";

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
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProject();
    }
  }, [slug]);

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
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/projects')}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // If project not found, show 404
  if (!project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              onClick={() => navigate('/projects')}
              className="min-w-[180px]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
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
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Project Demo</h3>
                <YouTubeEmbed 
                  url={project.video_url}
                  title={`${project.title} - Demo Video`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 