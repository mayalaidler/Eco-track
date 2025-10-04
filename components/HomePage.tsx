import React from 'react';
import { AppView } from '../types';
import GridBackground from './GridBackground';

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
  <div className="group bg-white backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 h-full hover:shadow-2xl hover:shadow-green-500/20">
    <div className="mb-4 h-20 w-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">{icon}</div>
    <h3 className="text-2xl font-Cambria font-bold mb-2">{title}</h3>
    <p className="text-brand-gray font-Cambria mb-10 flex-grow">{description}</p>
    <button
      onClick={onClick}
      className="bg-brand-green text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-dark-green transition-colors duration-300"
    >
      {buttonText}
    </button>
  </div>
);


const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
      <div className="text-center p-10 animate-fadeInUp">
          <h2 className="text-5xl font-extrabold text-white mb-4">
            Understand & Improve Your Environmental Impact
          </h2>
          <p className="text-lg text-brand-gray max-w-3xl mx-auto mb-12 text-white">
            EcoTrack provides simple tools to help you make more sustainable choices.
            Start by calculating your carbon footprint or learning local recycling rules.
          </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-20">
        <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <FeatureCard
              title="Carbon Footprint Calculator"
              description="Take a quick lifestyle quiz to get a personalized estimate of your carbon footprint and discover actionable tips to reduce it."
              buttonText="Start Quiz"
              icon={<img src="https://media.istockphoto.com/id/1441625773/vector/co2-footprint-vector-icon.jpg?s=612x612&w=0&k=20&c=HrPur_ku2kgpSzCoKSNEmqWONQogsZFYP0M7z0z9Js0=" width ="70" height = "120" alt="Animated footprint icon" />}
              onClick={() => onNavigate(AppView.QUIZ)}
            />
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <FeatureCard
              title="Local Recycling Guide"
              description="Confused about what you can recycle? Enter your location and an item to get clear, local recycling guidelines in seconds."
              buttonText="Find Info"
              icon={<img src="https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyanZwaHY0Y25idnR3bWJ0bGs4OGVia2thZWgyaHhlbGdpbXJzdGtpdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/RfTiFjM3aNAbXB5TDQ/200w.gif" height = "110" width = "100" />}
              onClick={() => onNavigate(AppView.RECYCLING)}
            />
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
             <FeatureCard
              title="Eco Actions Tracker"
              description="Log your sustainable actions, earn points for your positive impact, and see how you rank on the community leaderboard."
              buttonText="Log Action"
              icon={<img src="https://cdn-icons-gif.flaticon.com/15374/15374834.gif" className="w-20 h-20" alt="Animated chart icon" height = "50" width ="100"/>}

              onClick={() => onNavigate(AppView.ECO_ACTIONS)}
            />
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
             <FeatureCard
              title="Live Air Quality"
              description="View a real-time chart of local CO2 emissions to stay informed about the air you breathe."
              buttonText="View Chart"
              icon={<img src="https://media.lordicon.com/icons/wired/gradient/812-wind.gif" width="80" height="80" />}
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
