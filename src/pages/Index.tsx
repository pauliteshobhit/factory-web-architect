import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import FeatureCard from '../components/FeatureCard';
import ProjectPreviewCard from '../components/ProjectPreviewCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileVideo, FileText, MessageSquare } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const featuredProjects = [
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
  
  const trustedOrganizations = [
    "Stanford University", "MIT", "Google", "Microsoft", "Tesla", "Amazon"
  ];

  const handleViewProject = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view this project.",
        variant: "default",
      });
      navigate('/login');
    } else {
      navigate(`/projects/${featuredProjects[0].slug}`);
    }
  };

  const handleAuthAction = (action: 'explore' | 'get-started') => {
    if (user) {
      // User is logged in, navigate to appropriate page
      switch (action) {
        case 'explore':
          navigate('/projects');
          break;
        case 'get-started':
          navigate('/projects');
          break;
      }
    } else {
      // User is not logged in, show toast and navigate to login
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature.",
        variant: "default",
      });
      navigate('/login');
    }
  };

  return (
    <Layout>
      {/* Hero Section - Enhanced with animations and subtle details */}
      <section className="py-16 md:py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          {/* Animated background shapes */}
          <motion.div 
            className="absolute -top-20 -left-10 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"
            animate={{ 
              x: [0, 10, 0],
              y: [0, 15, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8, 
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute top-10 -right-10 w-72 h-72 bg-blue-300/10 rounded-full filter blur-3xl"
            animate={{ 
              x: [0, -15, 0],
              y: [0, 10, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 10, 
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-1/4 w-48 h-48 bg-factory-400/5 rounded-full filter blur-2xl"
            animate={{ 
              x: [0, 20, 0],
              y: [0, -10, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 12, 
              ease: "easeInOut",
              delay: 1
            }}
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight relative z-10">
              Explore Real-World <span className="text-primary">AI Projects.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Learn by building. Download docs, watch walkthroughs, and get community feedback.
            </p>
            {/* New supporting subtitle */}
            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of developers building the next generation of AI applications
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button 
              size="lg" 
              className="min-w-[180px] h-12 text-base"
              onClick={() => handleAuthAction('explore')}
            >
              Explore Projects <ArrowRight className="ml-1.5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="min-w-[180px] h-12 text-base"
              onClick={handleViewProject}
            >
              View Project
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section - NEW */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-xl md:text-2xl font-medium text-muted-foreground mb-8">
            Trusted by learners from top schools and startups
          </h2>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {trustedOrganizations.map((org, index) => (
              <motion.div 
                key={index}
                className="h-12 w-32 bg-muted/50 rounded flex items-center justify-center text-muted-foreground/70 font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {org}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔁 Featured Projects Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Jump into production-ready AI and web development projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map(project => (
              <ProjectPreviewCard key={project.id} project={project} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="min-w-[180px]"
              onClick={() => handleAuthAction('explore')}
            >
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* ✅ Feature Highlights Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Master AI Development</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive resources to help you build production-ready AI applications
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileVideo size={28} />}
              title="Watch Guided Videos"
              description="Learn step-by-step with detailed video explanations from industry experts."
            />
            <FeatureCard 
              icon={<FileText size={28} />}
              title="Download Docs & Assets"
              description="Get all the source code, documentation, and resources you need to succeed."
            />
            <FeatureCard 
              icon={<MessageSquare size={28} />}
              title="Join Discussions"
              description="Connect with a community of developers to share ideas and get help."
            />
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full filter blur-xl"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">Ready to Start Building?</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of developers building the next generation of AI applications
            </p>
            <Button 
              size="lg" 
              className="min-w-[180px] relative z-10"
              onClick={() => handleAuthAction('get-started')}
            >
              {user ? 'Explore Projects' : 'Get Started Today'}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
