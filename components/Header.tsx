
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
  currentPage: Page;
}

const NavLink: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  children: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, children }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => setCurrentPage(page)}
      className={`px-4 py-2 text-sm uppercase tracking-widest transition-colors duration-300 ${
        isActive
          ? 'text-yellow-400 glow-text'
          : 'text-gray-300 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ setCurrentPage, currentPage }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-black bg-opacity-80 backdrop-blur-lg">
      <nav className="container mx-auto flex items-center justify-between p-4 px-6 border-b border-gray-800">
        <div 
            className="font-cinzel text-2xl font-bold tracking-wider text-white cursor-pointer"
            onClick={() => setCurrentPage(Page.Home)}
        >
          LUMIN<span className="text-yellow-400">ARK</span>
        </div>
        <div className="flex items-center space-x-2">
          <NavLink page={Page.Home} currentPage={currentPage} setCurrentPage={setCurrentPage}>Home</NavLink>
          <NavLink page={Page.Customize} currentPage={currentPage} setCurrentPage={setCurrentPage}>Craft Yours</NavLink>
          <NavLink page={Page.Gallery} currentPage={currentPage} setCurrentPage={setCurrentPage}>Gallery</NavLink>
          <NavLink page={Page.About} currentPage={currentPage} setCurrentPage={setCurrentPage}>About</NavLink>
          <NavLink page={Page.Contact} currentPage={currentPage} setCurrentPage={setCurrentPage}>Contact</NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;
