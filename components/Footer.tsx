
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
           <h2 className="font-cinzel text-2xl font-bold tracking-wider text-white">
              LUMIN<span className="text-yellow-400">ARK</span>
            </h2>
          <p className="max-w-md mx-auto mt-4 text-gray-400">Where Light Reveals the Soul. Craft your own masterpiece of light, a testament to enduring artistry and personal vision.</p>
          <div className="flex justify-center mt-6">
             {/* Social media icons can go here */}
          </div>
        </div>

        <hr className="my-8 border-gray-800" />

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-400">© 2024 Luminark. All Rights Reserved.</p>
          <div className="flex mt-3 -mx-2 sm:mt-0">
            <a href="#" className="mx-2 text-sm text-gray-400 transition-colors duration-300 hover:text-gray-300" aria-label="Privacy Policy"> Privacy Policy </a>
            <a href="#" className="mx-2 text-sm text-gray-400 transition-colors duration-300 hover:text-gray-300" aria-label="Terms of Service"> Terms of Service </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
