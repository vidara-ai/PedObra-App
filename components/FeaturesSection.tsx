
import React from 'react';
import FeatureCard from './FeatureCard';
import { FEATURES } from '../constants';

const FeaturesSection: React.FC = () => {
  return (
    <section id="funcionalidades" className="bg-[#0B0B0B] py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center md:text-left">
          <span className="text-[#F97316] font-bold tracking-widest uppercase text-sm">
            Recursos Industriais
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4 tracking-tighter">
            Eficiência do pedido <br className="hidden md:block" /> ao recebimento.
          </h2>
          <div className="h-1.5 w-20 bg-[#F97316] mt-6 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
