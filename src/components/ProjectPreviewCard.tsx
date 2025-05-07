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
  category?: string;
}

interface ProjectPreviewCardProps {
  project: Project;
}

const ProjectPreviewCard = ({ project }: ProjectPreviewCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col bg-factory-50 border border-factory-200 hover:border-factory-400 transition-all duration-300 hover:shadow-md hover:-translate-y-1 rounded-lg">
      {/* Project Image */}
      <div className="h-52 overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      {/* Project Content */}
      <CardContent className="flex-grow p-6">
        {project.category && (
          <span className="inline-block bg-factory-100 text-factory-600 text-xs font-semibold px-2 py-1 rounded-full mb-3">
            {project.category}
          </span>
        )}
        <h3 className="text-xl font-semibold text-factory-800 mb-2">{project.title}</h3>
        <p className="text-factory-500">{project.description}</p>
      </CardContent>
      
      {/* Project Footer */}
      <CardFooter className="p-6 pt-0">
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          className="w-full text-factory-700 border-factory-300 hover:bg-factory-100"
        >
          <Link to={`/projects/${project.slug}`}>
            View Project
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectPreviewCard;

