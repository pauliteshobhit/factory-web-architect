
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Home, FolderCode, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  
  // Handle scroll behavior for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to check if the link is active
  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={clsx(
        'w-full py-4 z-50 bg-background transition-all duration-200',
        isSticky && 'sticky top-0 shadow-sm'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center group hover:scale-105 transition-transform duration-200" 
              aria-label="theAIfactory Home"
            >
              <img 
                src="/logo.svg" 
                alt="theAIfactory Logo" 
                className="h-8 w-auto dark:invert mr-2"
              />
              <span className="hidden sm:inline text-xl md:text-2xl font-medium text-foreground transition-colors">
                theAIfactory
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={clsx(
                "flex items-center text-sm font-medium transition-colors",
                isLinkActive('/') 
                  ? "text-outskill-600 font-medium" 
                  : "text-muted-foreground hover:text-outskill-500"
              )}
            >
              <Home size={18} className="mr-1.5" />
              Home
            </Link>
            <Link 
              to="/projects" 
              className={clsx(
                "flex items-center text-sm font-medium transition-colors",
                isLinkActive('/projects') 
                  ? "text-outskill-600 font-medium" 
                  : "text-muted-foreground hover:text-outskill-500"
              )}
            >
              <FolderCode size={18} className="mr-1.5" />
              Projects
            </Link>
            <Link 
              to="/profile" 
              className={clsx(
                "flex items-center text-sm font-medium transition-colors",
                isLinkActive('/profile') 
                  ? "text-outskill-600 font-medium" 
                  : "text-muted-foreground hover:text-outskill-500"
              )}
            >
              <User size={18} className="mr-1.5" />
              Profile
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <div className="hidden sm:flex">
              <ThemeToggle />
            </div>

            {/* Explore Button - Outskill Style */}
            <Button 
              variant="outskill" 
              size="sm"
              className="hidden sm:flex"
            >
              Explore Courses
            </Button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                className="p-1"
                aria-label="Menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
