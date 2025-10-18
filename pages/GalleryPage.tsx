
import React from 'react';
import { GALLERY_ITEMS } from '../constants';
import { GalleryItem, Page } from '../types';

interface GalleryPageProps {
  setCurrentPage: (page: Page) => void;
}

const GalleryCard: React.FC<{ item: GalleryItem; setCurrentPage: (page: Page) => void; }> = ({ item, setCurrentPage }) => (
    <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 group glow-effect">
        <div className="relative h-96 overflow-hidden">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-6">
                 <span className="text-xs bg-yellow-400 text-black font-semibold px-3 py-1 rounded-full uppercase">{item.category}</span>
                <h3 className="font-cinzel text-2xl text-white mt-2">{item.title}</h3>
            </div>
        </div>
        <div className="p-6">
            <p className="text-gray-400 mb-4 h-20">{item.story}</p>
            <div className="flex justify-between items-center">
                <button 
                  onClick={() => setCurrentPage(Page.Contact)}
                  className="px-6 py-2 font-semibold text-black bg-yellow-400 rounded-md hover:bg-yellow-300 transition-colors duration-300"
                >
                    Request Ownership
                </button>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Limited Edition</p>
                    <p className="font-bold text-white">1 of {item.limit}</p>
                </div>
            </div>
        </div>
    </div>
);


const GalleryPage: React.FC<GalleryPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-black py-20 animate-fadeIn">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-cinzel text-5xl font-bold text-white">Limited <span className="text-yellow-400">Collections</span></h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Discover our curated selection of pre-crafted masterpieces. Each piece is a rare artifact, with a strictly limited number of editions available to discerning collectors.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GALLERY_ITEMS.map(item => (
            <GalleryCard key={item.id} item={item} setCurrentPage={setCurrentPage} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
