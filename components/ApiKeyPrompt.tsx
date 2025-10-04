import React from 'react';

const KeyIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.629 5.629l-2.371 2.37-1.061 1.06a2.25 2.25 0 01-3.182 0 2.25 2.25 0 010-3.182l1.06-1.061 2.372-2.371A6 6 0 0115 7z" />
  </svg>
);


const ApiKeyPrompt: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full text-center transform transition-all" role="dialog" aria-modal="true" aria-labelledby="api-key-title">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
          <KeyIcon />
        </div>
        <h2 id="api-key-title" className="text-2xl font-bold text-brand-dark mb-2">API Key Not Configured</h2>
        <p className="text-brand-gray mb-6">
          This application requires a Google Gemini API key to function. Please follow the instructions to set it up for local development.
        </p>
        <div className="bg-brand-light-gray p-4 rounded-md text-left space-y-4">
          <div>
            <h3 className="font-bold text-brand-dark mb-2">Local Development Setup:</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-brand-gray">
              <li>
                  In your project's root directory, create a file named <code className="bg-gray-200 text-red-600 px-1 py-0.5 rounded font-mono">.env</code>.
              </li>
              <li>
                  Add your API key to this file, making sure it starts with <code className="font-mono">VITE_</code>. This prefix is a security feature of modern web development tools.
                  <pre className="bg-gray-700 text-white p-2 rounded mt-2 text-xs font-mono"><code>VITE_API_KEY="YOUR_GEMINI_API_KEY_HERE"</code></pre>
              </li>
              <li>
                <span className="font-bold">Crucially, you must stop and restart your development server</span> for the changes to take effect.
              </li>
            </ol>
          </div>
          <div>
            <h3 className="font-bold text-brand-dark mb-2">Why the "VITE_" prefix?</h3>
            <p className="text-sm text-brand-gray">
              Your development server uses Vite, which requires this prefix to securely expose variables to your browser code. It prevents sensitive keys from being leaked accidentally.
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-6">
          Your API key is accessed securely from the environment and is never stored in the code.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;