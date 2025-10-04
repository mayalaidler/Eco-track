import React from 'react';

interface HeaderProps {
    onHomeClick: () => void;
}

const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0118 10.5c0 5.385-4.365 9.75-9.75 9.75S-1.5 15.885-1.5 10.5a.75.75 0 011.5 0 8.25 8.25 0 0015 0c0-1.921-.666-3.7-1.83-5.143a.75.75 0 00-1.186-.948c-1.293.613-2.521 1.298-3.665 2.146a.75.75 0 01-1.018-.165A9.712 9.712 0 016 4.5a.75.75 0 01.75-.75 8.212 8.212 0 006.213-1.464z" clipRule="evenodd" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={onHomeClick}
        >
          <LeafIcon className="w-8 h-8 text-brand-green" />
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight">
            EcoTrack
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;