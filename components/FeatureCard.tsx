
import React from 'react';
import { Feature } from '../types';

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <div className="bg-[#1A1A1A] p-8 rounded-lg border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:bg-[#222222] hover:border-orange-500/30 group">
      <div className="mb-6 p-3 bg-white/5 rounded-md inline-block group-hover:bg-[#F97316]/20 transition-colors">
        <Icon className="w-8 h-8 text-[#F97316]" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
        {feature.title}
      </h3>
      <p className="text-gray-400 leading-relaxed text-sm md:text-base">
        {feature.description}
      </p>
    </div>
  );
};

export default FeatureCard;
