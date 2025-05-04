
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, FolderCode, User, LogIn } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogInOut: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose,
  isLoggedIn,
  onLogInOut
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-background z-50 shadow-xl p-6 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col space-y-6">
          {/* Mobile Menu Links */}
          <Link 
            to="/" 
            className="flex items-center text-lg font-medium hover:text-primary transition-colors py-2"
            onClick={onClose}
          >
            <Home size={20} className="mr-2" />
            Home
          </Link>
          <Link 
            to="/projects" 
            className="flex items-center text-lg font-medium hover:text-primary transition-colors py-2"
            onClick={onClose}
          >
            <FolderCode size={20} className="mr-2" />
            Projects
          </Link>
          <Link 
            to="/profile" 
            className="flex items-center text-lg font-medium hover:text-primary transition-colors py-2"
            onClick={onClose}
          >
            <User size={20} className="mr-2" />
            Profile
          </Link>
          
          {/* Mobile Auth Button */}
          <div className="pt-4 mt-4 border-t border-border">
            <Button 
              onClick={() => {
                onLogInOut();
                onClose();
              }}
              className="w-full flex items-center justify-center"
              variant="outline"
            >
              <LogIn size={20} className="mr-2" />
              {isLoggedIn ? 'Logout' : 'Login'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
