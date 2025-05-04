
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-6 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
            &copy; {currentYear} theAIfactory. All rights reserved.
          </p>
          
          {/* Optional Footer Links */}
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
