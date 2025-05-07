
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProjectPreviewCard from '../components/ProjectPreviewCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Sample project data (in a real app, this would come from an API)
const projectsData = [
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
  },
  {
    id: 4,
    title: "Personalized Recommendation Engine",
    description: "AI-driven content recommendations based on user preferences",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    slug: "recommendation-engine",
    category: "Recommender Systems"
  },
  {
    id: 5,
    title: "Computer Vision Toolkit",
    description: "Tools for object detection, recognition and classification",
    imageUrl: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1",
    slug: "computer-vision-toolkit",
    category: "Image AI"
  },
  {
    id: 6,
    title: "Speech Analytics Platform",
    description: "Real-time speech recognition and sentiment analysis tools",
    imageUrl: "https://images.unsplash.com/photo-1557436932-b8ea747c1d3b",
    slug: "speech-analytics",
    category: "NLP"
  }
];

// Extract unique categories
const allCategories = ["All", ...new Set(projectsData.map(project => project.category))];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(projectsData);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProjects(projectsData);
    } else {
      setFilteredProjects(projectsData.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory]);

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
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="min-w-[100px]"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
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
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-xl text-muted-foreground">No projects found in this category</p>
              <Button 
                onClick={() => setSelectedCategory("All")} 
                variant="outline"
                className="mt-4"
              >
                View all projects
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Projects;
