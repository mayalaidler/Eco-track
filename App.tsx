import React, { useState, useCallback } from 'react';
import HomePage from './components/HomePage';
import CarbonFootprintQuiz from './components/CarbonFootprintQuiz';
import RecyclingGuide from './components/RecyclingGuide';
import Header from './components/Header';
import Footer from './components/Footer';
import { AppView } from './types';
import EcoActions from './components/EcoActions';
import AirQualityChart from './components/Chart';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);

  const navigateTo = useCallback((newView: AppView) => {
    setView(newView);
    window.scrollTo(0, 0);
  }, []);

  const renderView = () => {
    switch (view) {
      case AppView.QUIZ:
        return <CarbonFootprintQuiz onBack={() => navigateTo(AppView.HOME)} />;
      case AppView.RECYCLING:
        return <RecyclingGuide onBack={() => navigateTo(AppView.HOME)} />;
      case AppView.ECO_ACTIONS:
        return <EcoActions onBack={() => navigateTo(AppView.HOME)} />;
      case AppView.AIR_QUALITY:
        return <AirQualityChart onBack={() => navigateTo(AppView.HOME)} />;
      case AppView.HOME:
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-brand-dark bg-black/50">
      <Header onHomeClick={() => navigateTo(AppView.HOME)} />
      {renderView()}
      <Footer />
    </div>
  );
};

export default App;
