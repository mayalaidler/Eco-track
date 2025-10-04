
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white mt-12">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} EcoTrack. Helping you build a sustainable future.</p>
      </div>
    </footer>
  );
};

export default Footer;
