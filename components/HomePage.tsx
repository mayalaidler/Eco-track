import React from 'react';
import { AppView } from '../types';

interface HomePageProps {
  // FIX: Corrected typo from AppVew to AppView
  onNavigate: (view: AppView) => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, buttonText, icon, onClick }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
    <div className="text-brand-green mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-brand-gray mb-6 flex-grow">{description}</p>
    <button
      onClick={onClick}
      className="bg-brand-green text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-dark-green transition-colors duration-300"
    >
      {buttonText}
    </button>
  </div>
);

const FootprintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.871 4.23C7.293 2.871 10.038 2.25 12.875 2.25c2.837 0 5.582.62 7.996 1.98M4.871 4.23a13.435 13.435 0 00-1.82 2.628m1.82-2.628c-.144.33-.28.665-.41.999M19.121 4.23c2.31 1.359 4.102 3.253 5.186 5.456M19.121 4.23a13.413 13.413 0 011.82 2.628m-1.82-2.628c.144.33.28.665.41.999M12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.25a.75.75 0 010 1.5.75.75 0 010-1.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.125 15.375c.135.33.28.66.435.983m-.435-.983a13.436 13.436 0 00-5.223 3.65m5.223-3.65a13.433 13.433 0 015.223 3.65m-5.223-3.65c.144.33.28.665.41.999" />
    </svg>
);
const RecycleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.548 0c-.275-.046-.55-.082-.825-.111m-1.102 0l-.053-.002L3.18 5.79m1.591-.012a48.058 48.058 0 013.478-.397m7.5 0a48.058 48.058 0 003.478.397m-7.5 0a48.108 48.108 0 01-3.478.397m12.548 0c.275.046.55.082.825.111m1.102 0l.053.002L20.82 5.79m-1.591.012a48.058 48.058 0 00-3.478-.397" />
    </svg>
);


const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      <div className="text-center p-10 bg-white rounded-xl shadow-lg" style={{
          backgroundImage: `url('https://picsum.photos/seed/nature/1200/400')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
      }}>
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg">
          <h2 className="text-4xl font-extrabold text-brand-dark mb-4">
            Understand & Improve Your Environmental Impact
          </h2>
          <p className="text-lg text-brand-gray max-w-3xl mx-auto">
            EcoTrack provides simple tools to help you make more sustainable choices.
            Start by calculating your carbon footprint or learning local recycling rules.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <FeatureCard
          title="Carbon Footprint Calculator"
          description="Take a quick lifestyle quiz to get a personalized estimate of your carbon footprint and discover actionable tips to reduce it."
          buttonText="Start Quiz"
          icon={<FootprintIcon />}
          onClick={() => onNavigate(AppView.QUIZ)}
        />
        <FeatureCard
          title="Local Recycling Guide"
          description="Confused about what you can recycle? Enter your location and an item to get clear, local recycling guidelines in seconds."
          buttonText="Find Info"
          icon={<RecycleIcon />}
          onClick={() => onNavigate(AppView.RECYCLING)}
        />
      </div>
    </div>
  );
};

export default HomePage;