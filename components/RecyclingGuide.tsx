import React, { useState, useRef } from 'react';
import { getRecyclingInfo } from '../services/geminiService';
import type { RecyclingResult } from '../types';
import Spinner from './Spinner';

interface RecyclingGuideProps {
  onBack: () => void;
}

const ImageUploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-gray group-hover:text-brand-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove "data:mime/type;base64," prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};


const RecyclingGuide: React.FC<RecyclingGuideProps> = ({ onBack }) => {
  const [location, setLocation] = useState('');
  const [item, setItem] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<RecyclingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setItem(''); // Clear text input when image is selected
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || (!item && !imageFile)) {
      setError('Please enter a location and either an item or an image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let apiResult: RecyclingResult;
      if (imageFile) {
        const base64Data = await fileToBase64(imageFile);
        apiResult = await getRecyclingInfo(location, undefined, { mimeType: imageFile.type, data: base64Data });
      } else {
        apiResult = await getRecyclingInfo(location, item);
      }
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
      <div className="bg-white p-8 rounded-xl shadow-lg animate-fadeInUp">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-brand-dark">Local Recycling Guide</h2>
          <p className="text-brand-gray mt-2">Enter your city and an item (or upload a photo) to get local recycling rules.</p>
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
              required
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
              disabled={isLoading || !!imageFile}
            />
          </div>
          
          <div className="flex items-center justify-center my-4">
            <span className="flex-shrink-0 text-gray-400">OR</span>
          </div>
          
          <div>
            {imagePreview ? (
                <div className="text-center">
                    <img src={imagePreview} alt="Item preview" className="max-h-48 w-auto inline-block rounded-lg shadow-md mb-4" />
                    <button type="button" onClick={handleRemoveImage} disabled={isLoading} className="text-sm text-red-600 hover:text-red-800">Remove Image</button>
                </div>
            ) : (
                <>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-brand-gray mb-1 text-center">Upload a Photo of the Item</label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="group mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-brand-green transition-colors"
                    >
                      <div className="space-y-1 text-center">
                        <ImageUploadIcon />
                        <div className="flex text-sm text-gray-600">
                          <span className="relative rounded-md font-medium text-brand-green group-hover:text-brand-dark-green focus-within:outline-none">
                            <span>Upload a file</span>
                            <input id="image-upload" ref={fileInputRef} name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                </>
            )}
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

        {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg animate-fadeInUp">{error}</div>}

        {result && (
          <div className="mt-8 pt-6 border-t border-gray-200 animate-fadeInUp">
            <h3 className="text-2xl font-bold mb-4">Recycling Guide for <span className="text-brand-green">{item || 'your item'}</span> in <span className="text-brand-green">{location}</span>:</h3>
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