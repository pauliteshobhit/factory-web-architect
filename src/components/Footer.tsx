import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/70 backdrop-blur-sm shadow-inner py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <Link to="/" className="text-2xl font-bold text-foreground">
              theAIfactory
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Discover real-world AI/Web projects with video walkthroughs, 
              downloadable resources, and a built-in community.
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <div className="grid grid-cols-3 gap-4">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} theAIfactory. All rights reserved.
          </p>

          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <a href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://github.com" target="_blank" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
