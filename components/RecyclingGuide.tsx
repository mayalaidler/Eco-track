
import React, { useState } from 'react';
import { getRecyclingInfo } from '../services/geminiService';
import type { RecyclingResult } from '../types';
import Spinner from './Spinner';

interface RecyclingGuideProps {
  onBack: () => void;
}

const RecyclingGuide: React.FC<RecyclingGuideProps> = ({ onBack }) => {
  const [location, setLocation] = useState('');
  const [item, setItem] = useState('');
  const [result, setResult] = useState<RecyclingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !item) {
      setError('Please enter both a location and an item.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await getRecyclingInfo(location, item);
      setResult(apiResult);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
       <button onClick={onBack} className="text-brand-green hover:text-brand-dark-green mb-4">&larr; Back to Home</button>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-brand-dark">Local Recycling Guide</h2>
          <p className="text-brand-gray mt-2">Enter your city and an item to get local recycling rules.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-brand-gray">Your Location (e.g., "San Francisco, CA")</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State/Country"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-green focus:border-brand-green"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="item" className="block text-sm font-medium text-brand-gray">Item to Recycle (e.g., "Plastic Bottles")</label>
            <input
              type="text"
              id="item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Pizza box, batteries, coffee cup..."
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-green focus:border-brand-green"
              disabled={isLoading}
            />
          </div>
          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-green hover:bg-brand-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:bg-gray-400"
            >
              {isLoading ? <Spinner /> : 'Find Recycling Info'}
            </button>
          </div>
        </form>

        {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {result && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold mb-4">Recycling Guide for <span className="text-brand-green">{item}</span> in <span className="text-brand-green">{location}</span>:</h3>
            <div className="prose max-w-none text-brand-gray whitespace-pre-wrap">
                {result.info}
            </div>

            {result.sources && result.sources.length > 0 && (
              <div className="mt-6">
                <h4 className="font-bold">Sources:</h4>
                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                  {result.sources.map((source, index) => (
                    <li key={index}>
                      <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {source.web.title || source.web.uri}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecyclingGuide;
