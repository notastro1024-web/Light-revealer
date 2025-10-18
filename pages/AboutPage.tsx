
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black py-20 animate-fadeIn">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-cinzel text-5xl font-bold text-white">The Light Behind <span className="text-yellow-400">Luminark</span></h1>
          <p className="text-gray-400 mt-4 max-w-3xl mx-auto">Our journey began with a simple yet profound idea: that art should not just be seen, but experienced. Luminark was born from a passion for both timeless craftsmanship and technological innovation.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden glow-effect">
            <img src="https://picsum.photos/seed/founder/800/1000" alt="Founder Portrait" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
             <div className="absolute bottom-0 left-0 p-8">
                <h3 className="font-cinzel text-3xl text-white">A Visionary's Spark</h3>
                <p className="text-gray-300 mt-2">The story of Luminark is the story of its founder, an artist and engineer who saw the potential to fuse light with narrative.</p>
            </div>
          </div>
          <div className="text-gray-300 leading-relaxed space-y-6">
            <h2 className="font-cinzel text-3xl text-white">Our <span className="text-yellow-400">Philosophy</span></h2>
            <p>We believe that light is the purest medium of expression. It can transform a space, evoke emotion, and tell a story in a way no other medium can. Our mission is to harness this power, giving collectors the tools to create or own a piece of art that is truly alive.</p>
            <p>Every Luminark frame is a testament to our core values:</p>
            <ul className="list-disc list-inside space-y-2 text-yellow-400">
              <li><span className="text-gray-300">Uncompromising Quality: From sustainably sourced wood to aerospace-grade metals, we select only the finest materials.</span></li>
              <li><span className="text-gray-300">Sustainable Beauty: Our proprietary lighting technology is engineered for maximum impact with minimal energy consumption.</span></li>
              <li><span className="text-gray-300">Personal Legacy: We don't just sell art frames; we help you create heirlooms. Each piece is a personal statement, crafted to last for generations.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
