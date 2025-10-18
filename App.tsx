
import React, { useState } from 'react';
import { Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CustomizationPage from './pages/CustomizationPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage setCurrentPage={setCurrentPage}/>;
      case Page.Customize:
        return <CustomizationPage />;
      case Page.Gallery:
        return <GalleryPage setCurrentPage={setCurrentPage}/>;
      case Page.About:
        return <AboutPage />;
      case Page.Contact:
        return <ContactPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-gray-200">
      <Header setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
