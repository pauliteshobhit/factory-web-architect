import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { isValidYouTubeUrl } from '@/lib/video';

interface ProjectData {
  title: string;
  description: string;
  slug: string;
  category: string;
  image_url: string;
  video_url?: string;
  documentation_url?: string;
  github_url?: string;
}

export function ProjectInsertTest() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    description: '',
    slug: '',
    category: '',
    image_url: '',
    video_url: '',
    documentation_url: '',
    github_url: '',
  });

  const categories = [
    "Image AI",
    "Text AI",
    "Audio AI",
    "Video AI",
    "Data Analysis",
    "Development Tools",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!projectData.title || !projectData.description || !projectData.slug || !projectData.image_url) {
        throw new Error('Please fill in all required fields');
      }

      // Validate slug format
      if (!/^[a-z0-9-]+$/.test(projectData.slug)) {
        throw new Error('Invalid slug format. Use lowercase letters, numbers, and hyphens only');
      }

      // Validate URLs
      if (projectData.video_url && !isValidYouTubeUrl(projectData.video_url)) {
        throw new Error('Invalid YouTube URL format');
      }

      // Sanitize data
      const sanitizedData = {
        title: projectData.title.trim(),
        description: projectData.description.trim(),
        slug: projectData.slug.trim(),
        category: projectData.category || null,
        image_url: projectData.image_url.trim(),
        video_url: projectData.video_url?.trim() || null,
        documentation_url: projectData.documentation_url?.trim() || null,
        github_url: projectData.github_url?.trim() || null,
      };

      console.log('Inserting project:', sanitizedData);

      const { error: insertError } = await supabase
        .from('projects')
        .insert(sanitizedData)
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(insertError.message);
      }

      toast({
        title: 'Success!',
        description: 'Project created successfully',
      });

      // Reset form
      setProjectData({
        title: '',
        description: '',
        slug: '',
        category: '',
        image_url: '',
        video_url: '',
        documentation_url: '',
        github_url: '',
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add test project function
  const insertTestProject = async () => {
    const testProject = {
      title: "Smart Dashboard",
      description: "A powerful analytics dashboard that provides real-time insights and customizable widgets for data visualization.",
      slug: "smart-dashboard",
      category: "Data Analysis",
      image_url: "https://picsum.photos/800/400",
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      documentation_url: "https://docs.example.com/smart-dashboard",
      github_url: "https://github.com/example/smart-dashboard"
    };

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Inserting test project:', testProject);
      
      const { data, error } = await supabase
        .from('projects')
        .insert(testProject)
        .select()
        .single();

      console.log('📦 Insert result:', { data, error });

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('A project with this slug already exists');
        }
        throw error;
      }

      toast({
        title: 'Success!',
        description: 'Test project created successfully',
      });

      // Reset form
      setProjectData({
        title: '',
        description: '',
        slug: '',
        category: '',
        image_url: '',
        video_url: '',
        documentation_url: '',
        github_url: '',
      });

    } catch (err) {
      console.error('❌ Error inserting test project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create test project';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Project Insertion</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add test project button */}
          <div className="mb-6">
            <Button
              onClick={insertTestProject}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating...' : 'Create Test Smart Dashboard Project'}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={projectData.title}
                onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter project title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter project description"
                required
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={projectData.slug}
                onChange={(e) => setProjectData(prev => ({ ...prev, slug: e.target.value }))}
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
                value={projectData.category}
                onValueChange={(value) => setProjectData(prev => ({ ...prev, category: value }))}
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
              <Label htmlFor="image_url">Cover Image URL *</Label>
              <Input
                id="image_url"
                value={projectData.image_url}
                onChange={(e) => setProjectData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="Enter image URL"
                required
              />
            </div>

            <div>
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                value={projectData.video_url}
                onChange={(e) => setProjectData(prev => ({ ...prev, video_url: e.target.value }))}
                placeholder="Enter YouTube video URL"
              />
            </div>

            <div>
              <Label htmlFor="documentation_url">Documentation URL</Label>
              <Input
                id="documentation_url"
                value={projectData.documentation_url}
                onChange={(e) => setProjectData(prev => ({ ...prev, documentation_url: e.target.value }))}
                placeholder="Enter documentation URL"
              />
            </div>

            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                value={projectData.github_url}
                onChange={(e) => setProjectData(prev => ({ ...prev, github_url: e.target.value }))}
                placeholder="Enter GitHub repository URL"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Test Project'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 