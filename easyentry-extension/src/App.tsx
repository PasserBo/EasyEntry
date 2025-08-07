import { useState, useEffect } from 'react';
import PresetSelector from './PresetSelector';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null); // This will hold user data from storage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check our own storage for the user session.
    const checkUserStorage = () => {
      chrome.storage.local.get(['loggedInUser'], (result) => {
        if (result.loggedInUser) {
          console.log("✅ Side Panel: Found user in storage:", result.loggedInUser);
          setUser(result.loggedInUser);
        } else {
          console.log("ℹ️ Side Panel: No user found in storage.");
          setUser(null);
        }
        setLoading(false);
      });
    };

    // Initial check
    checkUserStorage();

    // Listen for storage changes (when user logs in/out from web app)
    const handleStorageChange = (changes: {[key: string]: chrome.storage.StorageChange}) => {
      if (changes.loggedInUser) {
        console.log("🔄 Side Panel: Storage changed, updating user state:", changes.loggedInUser);
        if (changes.loggedInUser.newValue) {
          setUser(changes.loggedInUser.newValue);
        } else {
          setUser(null);
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    // Periodic check as backup (every 2 seconds while extension is open)
    const intervalId = setInterval(() => {
      chrome.storage.local.get(['loggedInUser'], (result) => {
        const currentUser = result.loggedInUser;
        // Only update if user state actually changed
        if ((currentUser && !user) || (!currentUser && user) || 
            (currentUser && user && currentUser.uid !== user.uid)) {
          console.log("🔄 Side Panel: Periodic check detected user change");
          setUser(currentUser || null);
        }
      });
    }, 2000);

    // Cleanup listener and interval on unmount
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      clearInterval(intervalId);
    };
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
      console.log("🚪 Side Panel: User logged out, session cleared");
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EasyEntry</h1>
                <p className="text-sm text-gray-600">Auto-fill Job Applications</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Welcome back!
                </p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full" title="Connected"></div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="space-y-6">
            <PresetSelector user={user} />
          </div>
          
          {/* Footer Section */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Sign Out
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              EasyEntry v0.1.0 • Side Panel Mode
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 min-h-screen flex flex-col justify-center">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">EasyEntry</h1>
            <p className="text-gray-600 mb-6">
              Simplify your job application process in Japan
            </p>
          </div>
          
          {/* Login Section */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Authentication Required
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Please sign in to access your job application presets and auto-fill features.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
              >
                Sign In to EasyEntry
              </button>
              
              <button
                onClick={() => {
                  setLoading(true);
                  chrome.storage.local.get(['loggedInUser'], (result) => {
                    if (result.loggedInUser) {
                      console.log("🔄 Manual refresh: Found user in storage");
                      setUser(result.loggedInUser);
                    } else {
                      console.log("🔄 Manual refresh: No user found");
                      setUser(null);
                    }
                    setLoading(false);
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Check Login Status
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Sign in will open the EasyEntry web app in a new tab. Click "Check Login Status" after signing in if the extension doesn't automatically refresh.
            </p>
          </div>
          
          {/* Features Preview */}
          <div className="mt-8 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Features:</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Auto-fill job applications
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Manage application presets
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Persistent side panel
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
