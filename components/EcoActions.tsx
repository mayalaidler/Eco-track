import React, { useState, useEffect } from 'react';
import { analyzeEcoAction } from '../services/geminiService.ts';
import type { EcoAction, LeaderboardEntry } from '../types.ts';
import Spinner from './Spinner.tsx';

interface EcoActionsProps {
  onBack: () => void;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'EcoWarrior22', score: 1250 },
  { name: 'GreenThumb', score: 980 },
  { name: 'RecycleQueen', score: 760 },
  { name: 'PlanetSaver', score: 540 },
  { name: 'CompostKing', score: 320 },
];

const EcoActions: React.FC<EcoActionsProps> = ({ onBack }) => {
  const [actionInput, setActionInput] = useState('');
  const [actions, setActions] = useState<EcoAction[]>([]);
  const [userScore, setUserScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Combine mock data with user score and sort
    const userEntry: LeaderboardEntry = { name: 'You', score: userScore, isUser: true };
    const combined = [...MOCK_LEADERBOARD, userEntry];
    combined.sort((a, b) => b.score - a.score);
    setLeaderboard(combined);
  }, [userScore]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionInput.trim()) {
      setError('Please enter an action.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeEcoAction(actionInput);
      const newAction: EcoAction = {
        id: new Date().toISOString(),
        text: actionInput,
        ...result,
      };
      setActions(prev => [newAction, ...prev]);
      setUserScore(prev => prev + result.points);
      setActionInput('');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="text-brand-green hover:text-brand-dark-green mb-4">&larr; Back to Home</button>
      <div className="grid lg:grid-cols-2 gap-8">
        
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-lg animate-fadeInUp">
            <h2 className="text-3xl font-bold text-brand-dark mb-2">Log Your Eco Action</h2>
            <p className="text-brand-gray mb-6">Did something good for the planet? Log it here to earn points!</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="action" className="sr-only">Your Action</label>
                <input
                  type="text"
                  id="action"
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                  placeholder="e.g., Used a reusable coffee cup"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-green focus:border-brand-green"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-green hover:bg-brand-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:bg-gray-400"
              >
                {isLoading ? <Spinner /> : 'Log My Action & Get Points'}
              </button>
            </form>
            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold text-brand-dark mb-4">Your Action Log</h3>
            {actions.length === 0 ? (
              <p className="text-brand-gray">Your logged actions will appear here.</p>
            ) : (
              <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {actions.map((action, index) => (
                  <li key={action.id} className={`p-4 bg-brand-light-gray rounded-lg ${index === 0 ? 'animate-fadeInUp' : ''}`}>
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-brand-dark flex-1">{action.text}</p>
                      <p className="ml-4 font-bold text-brand-green text-lg">+{action.points}</p>
                    </div>
                    <p className="text-sm text-brand-gray mt-1">{action.analysis}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-3xl font-bold text-brand-dark mb-2 text-center">Leaderboard</h2>
            <p className="text-brand-gray mb-6 text-center">See how your actions stack up!</p>
            <ul className="space-y-3">
              {leaderboard.map((entry, index) => (
                 <li key={`${entry.name}-${index}`} className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                    entry.isUser ? 'bg-green-100 border-2 border-brand-green scale-105' : 'bg-brand-light-gray'
                 }`}>
                    <div className="flex items-center space-x-4">
                        <span className="font-bold text-brand-gray w-8 text-center text-lg">{index + 1}</span>
                        <span className={`font-semibold text-lg ${entry.isUser ? 'text-brand-dark-green' : 'text-brand-dark'}`}>{entry.name}</span>
                    </div>
                    <span className={`font-extrabold text-lg ${entry.isUser ? 'text-brand-dark-green' : 'text-brand-green'}`}>{entry.score} pts</span>
                 </li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default EcoActions;
