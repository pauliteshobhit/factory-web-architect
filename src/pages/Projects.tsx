import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProjectPreviewCard from '../components/ProjectPreviewCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Projects = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, description, slug, category, image_url, created_at')
          .order('created_at', { ascending: false });
        if (error) {
          toast({ title: '❌ Failed to fetch projects', description: error.message, variant: 'destructive' });
          setError(error.message);
          console.error('Supabase fetch error:', error);
          setProjects([]);
          return;
        }
        setProjects(data || []);
        console.log('✅ Loaded projects:', data?.length);
      } catch (err) {
        toast({ title: '❌ Unexpected error', description: 'Something went wrong while loading projects', variant: 'destructive' });
        setError('Unexpected error');
        console.error('Unexpected fetch error:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [toast]);

  // Extract unique categories from loaded projects
  const allCategories = ['All', ...Array.from(new Set(projects.map((project) => project.category)))];

  // Filter projects by category
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((project) => project.category === selectedCategory);

  return (
    <Layout>
      <div className="space-y-12">
        {/* Page Header */}
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Explore Projects
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover innovative AI projects, learn from detailed documentation, and build your skills
          </motion.p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {allCategories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className="min-w-[100px]"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-16">
            <p className="text-xl text-destructive">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : filteredProjects.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <ProjectPreviewCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-xl text-muted-foreground">No projects found in this category</p>
            <Button 
              onClick={() => setSelectedCategory('All')} 
              variant="outline"
              className="mt-4"
            >
              View all projects
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
