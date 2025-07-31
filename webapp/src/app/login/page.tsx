'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Add debugging for window message events
  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      if (event.data.type === "EASYENTRY_EXTENSION_READY") {
        console.log("🔌 Web App: EasyEntry extension detected and ready:", event.data);
      } else if (event.data.type === "EASYENTRY_TEST_MESSAGE") {
        console.log("🧪 Web App: Received test message from extension:", event.data);
      }
    };

    window.addEventListener('message', messageListener);
    console.log("👂 Web App: Listening for extension messages");

    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      console.log("🔐 Web App: Attempting login...");
      // Use Firebase auth directly to get user credentials
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // ---- SEND USER DATA TO EXTENSION ----
      console.log("✅ Web App: Login successful! Broadcasting user data to extension...");
      
      const loginMessage = { 
        type: "LOGIN_SUCCESS",
        payload: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          // Add any other data the extension might need
        },
        timestamp: Date.now()
      };
      
      console.log("📢 Web App: Posting message with user data:", loginMessage);
      window.postMessage(loginMessage, "*");
      
      // Wait a moment to ensure message is processed
      setTimeout(() => {
        console.log("📢 Web App: Re-broadcasting login message (backup)");
        window.postMessage(loginMessage, "*");
      }, 500);
      // ---- END OF USER DATA BROADCAST ----
      
      console.log("🎯 Web App: Redirecting to dashboard...");
      router.push('/dashboard');
    } catch (error) {
      console.error("❌ Web App: Login failed:", error);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null; // Prevent flash of login form
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to EasyEntry
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 