
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import FeatureCard from '../components/FeatureCard';
import ProjectPreviewCard from '../components/ProjectPreviewCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileVideo, FileText, MessageSquare } from 'lucide-react';

const Index = () => {
  // Sample project data with categories
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-28">
        <div className="max-w-5xl mx-auto text-center px-4">
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-20 -left-10 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
            <div className="absolute top-10 -right-10 w-72 h-72 bg-blue-300/10 rounded-full filter blur-3xl"></div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight relative z-10">
              Explore Real-World <span className="text-primary">AI Projects.</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Learn by building. Download docs, watch walkthroughs, and get community feedback.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-[180px] h-12 text-base">
              <Link to="/projects">
                Explore Projects <ArrowRight className="ml-1.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[180px] h-12 text-base">
              <Link to="/signup">
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
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

      {/* Trusted By Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            Trusted by learners from top schools and startups
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 items-center justify-items-center">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="h-12 w-24 md:h-16 md:w-32 bg-gray-200 dark:bg-gray-800 rounded-md opacity-60"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Preview Projects Section */}
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
            <Button asChild variant="outline" size="lg" className="min-w-[180px]">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full filter blur-xl"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">Ready to Start Building?</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of developers building the next generation of AI applications
            </p>
            <Button asChild size="lg" className="min-w-[180px] relative z-10">
              <Link to="/signup">
                Get Started Today
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
