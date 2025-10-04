import React from 'react';
import { AppView } from '../types';

interface HomePageProps {
  onNavigate: (view: AppView) => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, buttonText, icon, onClick }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 h-full">
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
const LeaderboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const AirIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25c-2.075 0-3.845.85-5.18 2.233a.75.75 0 00.95 1.166A3.75 3.75 0 0112 10.5a3.75 3.75 0 013.23 1.649.75.75 0 10.95-1.166A5.25 5.25 0 0012 8.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 15.75c-1.33 0-2.438-.85-2.92-2.016a.75.75 0 011.39-.584A2.25 2.25 0 003.75 15a2.25 2.25 0 002.21-1.666.75.75 0 011.42.448A3.75 3.75 0 013.75 15.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 15.75c1.33 0 2.438-.85 2.92-2.016a.75.75 0 00-1.39-.584A2.25 2.25 0 0120.25 15a2.25 2.25 0 01-2.21-1.666.75.75 0 00-1.42.448A3.75 3.75 0 0020.25 15.75z" />
    </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      <div className="text-center p-10 bg-white rounded-xl shadow-lg animate-fadeInUp" style={{
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

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <FeatureCard
              title="Carbon Footprint Calculator"
              description="Take a quick lifestyle quiz to get a personalized estimate of your carbon footprint and discover actionable tips to reduce it."
              buttonText="Start Quiz"
              icon={<FootprintIcon />}
              onClick={() => onNavigate(AppView.QUIZ)}
            />
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <FeatureCard
              title="Local Recycling Guide"
              description="Confused about what you can recycle? Enter your location and an item to get clear, local recycling guidelines in seconds."
              buttonText="Find Info"
              icon={<RecycleIcon />}
              onClick={() => onNavigate(AppView.RECYCLING)}
            />
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
             <FeatureCard
              title="Eco Actions Tracker"
              description="Log your sustainable actions, earn points for your positive impact, and see how you rank on the community leaderboard."
              buttonText="Log Action"
              icon={<LeaderboardIcon />}
              onClick={() => onNavigate(AppView.ECO_ACTIONS)}
            />
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
             <FeatureCard
              title="Live Air Quality"
              description="View a real-time chart of local CO2 emissions to stay informed about the air you breathe."
              buttonText="View Chart"
              icon={<AirIcon />}
              onClick={() => onNavigate(AppView.AIR_QUALITY)}
            />
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
        <FeatureCard
          title="Find Local Resources"
          description="Locate nearby recycling centers, thrift stores, and farmer's markets to support your sustainable lifestyle."
          buttonText="Explore Now"
          icon={<MapPinIcon />}
          onClick={() => onNavigate(AppView.LOCAL_RESOURCES)}
        />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
