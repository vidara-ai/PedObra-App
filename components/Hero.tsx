
import React from 'react';
import { VIDEO_HERO_URL } from '../constants';

interface HeroProps {
  onActionClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onActionClick }) => {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none">
        <source src={VIDEO_HERO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.45), rgba(0,0,0,0.2))' }} />
      <div className="relative z-20 container mx-auto px-6 md:px-12">
        <div className="max-w-3xl animate-fade-in-up text-center md:text-left">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6 tracking-tighter">
            Controle total dos pedidos da sua obra.
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl font-light">
            Organize materiais, aprove solicitações e elimine desperdícios.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button 
              onClick={onActionClick}
              className="w-full sm:w-auto px-12 py-5 bg-[#F97316] hover:bg-[#fb923c] text-white font-bold rounded-sm transition-all duration-200 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] active:scale-95"
            >
              Acessar Sistema
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
