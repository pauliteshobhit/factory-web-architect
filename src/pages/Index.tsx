
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import FeatureCard from '../components/FeatureCard';
import ProjectPreviewCard from '../components/ProjectPreviewCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileVideo, FileText, MessageSquare } from 'lucide-react';

const Index = () => {
  // Sample project data
  const featuredProjects = [
    {
      id: 1,
      title: "AI Image Generator",
      description: "Create stunning AI-generated artwork with just a text prompt",
      imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      slug: "ai-image-generator"
    },
    {
      id: 2,
      title: "Smart Dashboard",
      description: "Data visualization dashboard with React and real-time updates",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      slug: "smart-dashboard"
    },
    {
      id: 3,
      title: "ChatBot Interface",
      description: "Modern conversational UI with natural language processing",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      slug: "chatbot-interface"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
            Explore AI Projects.<br />Learn by Vibing.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Discover real-world AI/Web projects with video walkthroughs, downloadable resources, and a built-in community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-[160px]">
              <Link to="/projects">
                Explore Projects <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[160px]">
              <Link to="/signup">
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why theAIfactory?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileVideo />}
              title="Watch video walkthroughs"
              description="Learn step-by-step with detailed video explanations from industry experts."
            />
            <FeatureCard 
              icon={<FileText />}
              title="Download docs & resources"
              description="Get all the source code, documentation, and resources you need to succeed."
            />
            <FeatureCard 
              icon={<MessageSquare />}
              title="Join project discussions"
              description="Connect with a community of developers to share ideas and get help."
            />
          </div>
        </div>
      </section>

      {/* Preview Projects Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Projects</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Explore our most popular AI and web development projects
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map(project => (
              <ProjectPreviewCard key={project.id} project={project} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
