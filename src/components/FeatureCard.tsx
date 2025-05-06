import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-xl border border-border/50 hover:border-primary/40 hover:bg-white/60 backdrop-blur-sm h-full hover:-translate-y-1">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full bg-primary/10 hover:bg-primary/20 shadow-inner flex items-center justify-center text-primary mb-4 transition-all duration-300 ease-in-out">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
