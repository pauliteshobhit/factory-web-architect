
import React from 'react';
import Layout from '../components/Layout';

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Welcome to theAIfactory</h1>
        <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
          Discover modern AI and web coding projects
        </p>
      </div>
    </Layout>
  );
};

export default Index;
