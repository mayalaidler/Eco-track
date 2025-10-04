import React from 'react';

interface HeaderProps {
    onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={onHomeClick}
        >
          <img 
            src="/leaf.png" 
            alt="EcoTrack Logo" 
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight">
            EcoTrack
          </h1>
        </div>
      </div>
    </header>
  );
};


export default Header;