import { useState, useEffect } from 'react';
import PresetSelector from './PresetSelector';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null); // This will hold user data from storage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // DO NOT use onAuthStateChanged.
    // Check our own storage for the user session.
    chrome.storage.local.get(['loggedInUser'], (result) => {
      if (result.loggedInUser) {
        console.log("✅ Popup: Found user in storage:", result.loggedInUser);
        setUser(result.loggedInUser);
      } else {
        console.log("ℹ️ Popup: No user found in storage.");
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  const handleLogin = () => {
    // Open your website's login page in a new tab
    chrome.tabs.create({ url: 'http://localhost:3000/login' });
  };

  const handleLogout = () => {
    // To log out, we simply clear our local session and tell the background
    chrome.storage.local.remove('loggedInUser', () => {
      chrome.runtime.sendMessage({ type: "LOGOUT_SUCCESS" });
      setUser(null); // Update UI immediately
      console.log("🚪 Popup: User logged out, session cleared");
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 w-80 h-60">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-80">
      {user ? (
        <div className="p-4 w-80">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              EasyEntry
            </h3>
            <p className="text-sm text-gray-600">
              Welcome, {user.email}
            </p>
          </div>
          
          <PresetSelector user={user} />
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 w-80 text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              EasyEntry
            </h3>
            <p className="text-sm text-gray-600">
              Simplify your job application process in Japan
            </p>
          </div>
          
          <div className="mb-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Please log in to use EasyEntry.</p>
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Login to EasyEntry
          </button>
          
          <p className="text-xs text-gray-500 mt-3">
            This will open the EasyEntry web app in a new tab
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
