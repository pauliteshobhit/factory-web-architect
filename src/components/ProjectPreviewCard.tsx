
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
}

interface ProjectPreviewCardProps {
  project: Project;
}

const ProjectPreviewCard = ({ project }: ProjectPreviewCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border border-border/50 hover:border-primary/20">
      {/* Project Image */}
      <div className="h-48 overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      {/* Project Content */}
      <CardContent className="flex-grow p-6">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-muted-foreground">{project.description}</p>
      </CardContent>
      
      {/* Project Footer */}
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to={`/projects/${project.slug}`}>
            View Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectPreviewCard;
