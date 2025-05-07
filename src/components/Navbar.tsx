
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileMenu from './MobileMenu';
import { Home, FolderCode, User, LogIn, Menu } from 'lucide-react';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder for auth state

  // Handle scroll behavior for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogInOut = () => {
    // Placeholder for authentication logic
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <header 
      className={`
        w-full py-4 z-50 bg-background transition-all duration-200
        ${isSticky ? 'sticky top-0 shadow-md' : ''}
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo and Site Name */}
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
              <span className="hidden sm:inline text-xl md:text-2xl font-bold text-factory-700 hover:text-factory-600 transition-colors">
                theAIfactory
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home size={18} className="mr-1" />
              Home
            </Link>
            <Link 
              to="/projects" 
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <FolderCode size={18} className="mr-1" />
              Projects
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <User size={18} className="mr-1" />
              Profile
            </Link>
          </div>

          {/* Auth Button (Desktop) */}
          <div className="hidden md:block">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogInOut}
              className="flex items-center"
            >
              <LogIn size={18} className="mr-1" />
              {isLoggedIn ? 'Logout' : 'Login'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleMobileMenu} 
              aria-label="Toggle Menu"
            >
              <Menu size={24} />
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogInOut={handleLogInOut}
      />
    </header>
  );
};

export default Navbar;
