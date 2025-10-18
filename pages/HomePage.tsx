
import React from 'react';
import { Page } from '../types';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
}

const FeatureCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-900/50 p-8 border border-gray-800 rounded-lg glow-subtle">
    <h3 className="font-cinzel text-xl text-yellow-400 mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{children}</p>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black z-0">
          <img src="https://picsum.photos/seed/hero-bg/1920/1080" alt="Abstract glowing art" className="w-full h-full object-cover opacity-30"/>
        </div>
        {/* Simple CSS Glow Animation */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-1/2 h-1/2 border-2 border-yellow-400/50 rounded-full animate-ping opacity-20"></div>
        </div>
        
        <div className="relative z-20 p-8">
          <h1 className="font-cinzel text-5xl md:text-7xl font-bold tracking-wider text-shadow-lg">
            LUMIN<span className="text-yellow-400">ARK</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto glow-text">
            Where Light Reveals the Soul.
          </p>
          <button 
            onClick={() => setCurrentPage(Page.Gallery)}
            className="mt-12 px-10 py-4 font-semibold text-black bg-yellow-400 rounded-md hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 glow-effect"
          >
            Explore Collection
          </button>
        </div>
      </section>

      {/* What Makes Luminark Rare Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-cinzel text-4xl font-bold text-white">What Makes Luminark <span className="text-yellow-400">Rare</span></h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard title="Eco-Minimalist Design">
              Marrying classic aesthetics with modern efficiency. Our frames consume minimal electricity, ensuring your art glows responsibly without compromising its timeless build.
            </FeatureCard>
            <FeatureCard title="Enduring Craftsmanship">
              Each Luminark is assembled with meticulous care using premium, long-lasting materials. It's not just an art piece; it's a legacy of light designed to inspire for generations.
            </FeatureCard>
            <FeatureCard title="Exclusively Yours">
              Created for the discerning collector, every frame is a unique statement. We offer bespoke customization to ensure your Luminark is a true reflection of your personal story.
            </FeatureCard>
          </div>
        </div>
      </section>
      
       {/* Quote Banner */}
      <section className="py-24 bg-gray-900/50">
          <div className="container mx-auto px-6 text-center">
              <p className="font-cinzel text-3xl text-gray-300 italic">"Only light can reveal what’s hidden in the soul."</p>
          </div>
      </section>
    </div>
  );
};

export default HomePage;
