
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg border border-outskill-100 hover:border-outskill-300 bg-white hover:bg-secondary/50 h-full hover:-translate-y-1 rounded-lg">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full bg-outskill-100 text-outskill-600 flex items-center justify-center mb-4 transition-all">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
