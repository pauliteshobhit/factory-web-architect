
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky Navbar */}
      <Navbar />
      
      {/* Main Content Container */}
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 md:px-8">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
