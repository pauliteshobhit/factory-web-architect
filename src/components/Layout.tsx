import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
// Optional: import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8 sm:px-6 md:px-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
