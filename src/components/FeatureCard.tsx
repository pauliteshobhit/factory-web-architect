import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg border border-factory-200 hover:border-factory-400 bg-factory-50 hover:bg-factory-100 h-full hover:-translate-y-1 rounded-lg">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full bg-factory-100 text-factory-600 flex items-center justify-center mb-4 transition-all">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-factory-800 mb-2">{title}</h3>
        <p className="text-factory-500">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

