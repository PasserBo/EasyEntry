'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LogOut, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileContainer from '@/components/ProfileContainer';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      
      // ---- NOTIFY EXTENSION OF LOGOUT ----
      console.log("🚪 Web App: User logged out, broadcasting to extension");
      window.postMessage({ 
        type: "LOGOUT_SUCCESS",
        timestamp: Date.now()
      }, "*");
      // ---- END OF LOGOUT BROADCAST ----
      
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">EasyEntry Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Demo Application Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Test Your Auto-Fill Setup
                </h3>
                <p className="text-gray-600">
                  Try our demo job application to test how EasyEntry auto-fills forms with your profile data.
                </p>
              </div>
              <Link
                href="/demo-application"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                Open Demo App
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content - Profile Container with Experience and Presets */}
        <ProfileContainer />
      </div>
    </ProtectedRoute>
  );
} 