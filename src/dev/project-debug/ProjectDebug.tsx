import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  documentationUrl?: string;
  githubUrl?: string;
  created_at: string;
}

export function ProjectDebug() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    slug: '',
    category: '',
    imageUrl: '',
    videoUrl: '',
    documentationUrl: '',
    githubUrl: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    "Image AI",
    "Text AI",
    "Audio AI",
    "Video AI",
    "Data Analysis",
    "Development Tools",
    "Other"
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate slug format
      if (!isValidSlug(newProject.slug)) {
        setError('Invalid slug format. Use lowercase letters, numbers, and hyphens only.');
        return;
      }

      // Validate URLs
      if (newProject.imageUrl && !isValidUrl(newProject.imageUrl)) {
        setError('Invalid image URL format');
        return;
      }

      if (newProject.videoUrl && !isValidVideoUrl(newProject.videoUrl)) {
        setError('Invalid video URL format');
        return;
      }

      if (newProject.documentationUrl && !isValidUrl(newProject.documentationUrl)) {
        setError('Invalid documentation URL format');
        return;
      }

      if (newProject.githubUrl && !isValidGithubUrl(newProject.githubUrl)) {
        setError('Invalid GitHub URL format');
        return;
      }

      // Create project with test data
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        slug: newProject.slug,
        category: newProject.category || null,
        image_url: newProject.imageUrl || null,
        video_url: newProject.videoUrl || null,
        documentation_url: newProject.documentationUrl || null,
        github_url: newProject.githubUrl || null,
      };

      const { error } = await supabase
        .from('projects')
        .insert([projectData]);

      if (error) throw error;
      
      setNewProject({
        title: '',
        description: '',
        slug: '',
        category: '',
        imageUrl: '',
        videoUrl: '',
        documentationUrl: '',
        githubUrl: '',
      });
      fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    }
  };

  const isValidSlug = (slug: string) => {
    return slug && 
           slug.trim().length > 0 && 
           !slug.includes(' ') && 
           /^[a-z0-9-]+$/.test(slug);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidVideoUrl = (url: string) => {
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/;
    const vimeoPattern = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)[0-9]+$/;
    const loomPattern = /^(https?:\/\/)?(www\.)?(loom\.com\/share\/)[a-zA-Z0-9]+$/;
    
    return youtubePattern.test(url) || vimeoPattern.test(url) || loomPattern.test(url);
  };

  const isValidGithubUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?(github\.com\/)[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/;
    return pattern.test(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Project Debug Utility</h1>

      {/* Create Test Project Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter project title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter project description"
                required
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={newProject.slug}
                onChange={(e) => setNewProject(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="e.g., ai-image-generator"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use lowercase letters, numbers, and hyphens only
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newProject.category}
                onValueChange={(value) => setNewProject(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="imageUrl">Cover Image URL</Label>
              <Input
                id="imageUrl"
                value={newProject.imageUrl}
                onChange={(e) => setNewProject(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="Enter image URL"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter a valid URL for the project cover image
              </p>
            </div>

            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={newProject.videoUrl}
                onChange={(e) => setNewProject(prev => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="Enter video URL (YouTube/Vimeo/Loom)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Link to a demo video or tutorial
              </p>
            </div>

            <div>
              <Label htmlFor="documentationUrl">Documentation URL</Label>
              <Input
                id="documentationUrl"
                value={newProject.documentationUrl}
                onChange={(e) => setNewProject(prev => ({ ...prev, documentationUrl: e.target.value }))}
                placeholder="Enter documentation URL"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Link to documentation (PDF, Notion, etc.)
              </p>
            </div>

            <div>
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={newProject.githubUrl}
                onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="Enter GitHub repository URL"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Link to the project's GitHub repository
              </p>
            </div>

            <Button type="submit" className="w-full">Create Project</Button>
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Projects List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading projects...</p>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Slug: {project.slug}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Category: {project.category || 'None'}
                      </p>
                      {project.videoUrl && (
                        <p className="text-sm text-muted-foreground">
                          Video: {project.videoUrl}
                        </p>
                      )}
                      {project.documentationUrl && (
                        <p className="text-sm text-muted-foreground">
                          Docs: {project.documentationUrl}
                        </p>
                      )}
                      {project.githubUrl && (
                        <p className="text-sm text-muted-foreground">
                          GitHub: {project.githubUrl}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(project.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isValidSlug(project.slug) && (
                        <Alert variant="destructive" className="py-1 px-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>Invalid Slug</AlertDescription>
                        </Alert>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/projects/${project.slug}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <details>
                      <summary className="cursor-pointer text-sm text-muted-foreground">
                        Raw JSON
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(project, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Current User: {user ? user.email : 'Not logged in'}</p>
          <p>User ID: {user?.id || 'N/A'}</p>
          <p>Can Read Projects: {user ? 'Yes' : 'No'}</p>
        </CardContent>
      </Card>
    </div>
  );
} 